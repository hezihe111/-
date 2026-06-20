import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";

const PORT = Number(process.env.PORT || 8097);
const rooms = new Map();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATIC_ROOT = __dirname;
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function roomFor(code) {
  const key = String(code || "ZIHE01").trim().toUpperCase() || "ZIHE01";
  if (!rooms.has(key)) {
    rooms.set(key, {
      code: key,
      clients: new Map(),
      players: new Map(),
      hostId: "",
      snapshot: null,
      roomSave: null,
      activeFeatures: {},
      updatedAt: Date.now(),
    });
  }
  return rooms.get(key);
}

function safeSend(ws, data) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(data));
}

function players(room) {
  return [...room.players.values()];
}

function broadcast(room, data, exceptId = "") {
  for (const [clientId, ws] of room.clients.entries()) {
    if (clientId !== exceptId) safeSend(ws, data);
  }
}

function broadcastRoomState(room) {
  broadcast(room, { type: "room_state", players: players(room), hostId: room.hostId });
}

function refreshHost(room) {
  if (room.hostId && room.clients.has(room.hostId)) return;
  room.hostId = room.clients.keys().next().value || "";
}

function migrateOverseasFeatureHosts(room, previousHostId) {
  if (!room.hostId || room.hostId === previousHostId) return;
  const hostName = room.players.get(room.hostId)?.name || "联机宗门";
  const features = [
    [room.activeFeatures.adventureLobby, "lobby"],
    [room.activeFeatures.bossLobby, "lobby"],
    [room.activeFeatures.overseasLobby, "lobby"],
    [room.activeFeatures.overseasCouncil, "council"],
    [room.activeFeatures.overseasTrade, "tradeRoute"],
  ];
  for (const [feature, payloadKey] of features) {
    const data = feature?.payload?.[payloadKey];
    if (!data || data.hostId !== previousHostId) continue;
    data.hostId = room.hostId;
    data.hostName = hostName;
    feature.sourceId = "server";
    feature.sourceName = "房间服务器";
    broadcast(room, feature);
  }
}

function cacheFeature(room, msg) {
  const action = msg.action;
  const trade = msg.payload?.trade;
  if (action === "lobby_start") room.activeFeatures.lobbyStart = msg;
  if (action === "auction_open") room.activeFeatures.auction = msg;
  if (action === "auction_bid" && room.activeFeatures.auction?.payload?.auction) {
    const auction = room.activeFeatures.auction.payload.auction;
    const bid = msg.payload?.bid || {};
    auction.currentPrice = Number(bid.price || auction.currentPrice || 0);
    auction.leaderName = bid.leaderName || msg.sourceName || auction.leaderName || "";
    auction.leaderId = bid.leaderId || msg.sourceId || auction.leaderId || "";
    auction.round = Number(bid.round || auction.round || 1);
    auction.history = Array.isArray(auction.history) ? auction.history : [];
    auction.history.push({ id: msg.sourceId, name: auction.leaderName, price: auction.currentPrice });
  }
  if (action === "auction_pass" && room.activeFeatures.auction?.payload?.auction) {
    const auction = room.activeFeatures.auction.payload.auction;
    auction.passed = auction.passed || {};
    auction.passed[msg.sourceId] = true;
  }
  if (action === "auction_result") delete room.activeFeatures.auction;
  if (action === "council_open") room.activeFeatures.council = msg;
  if (action === "council_vote" && room.activeFeatures.council?.payload?.council) {
    const council = room.activeFeatures.council.payload.council;
    council.votes = council.votes || {};
    council.votes[msg.sourceId] = msg.payload?.vote;
  }
  if (action === "council_result") delete room.activeFeatures.council;
  if (action === "tournament_open") room.activeFeatures.tournament = msg;
  if (action === "tournament_ready" && !room.activeFeatures.tournament) {
    room.activeFeatures.tournament = {
      type: "room_feature",
      sourceId: "server",
      sourceName: "房间服务器",
      action: "tournament_open",
      payload: { tournament: { year: msg.payload?.year || 0, ready: {}, resolved: false } },
    };
  }
  if (action === "tournament_ready" && room.activeFeatures.tournament) {
    const ready = room.activeFeatures.tournament.payload?.tournament?.ready || {};
    if (msg.payload?.team?.id) ready[msg.payload.team.id] = msg.payload.team;
    room.activeFeatures.tournament.payload.tournament.ready = ready;
  }
  if (action === "tournament_result") delete room.activeFeatures.tournament;
  if (action === "world_adventure_open") room.activeFeatures.worldAdventure = msg;
  if (action === "adventure_lobby_open" || action === "adventure_lobby_ready" || action === "adventure_lobby_decline") {
    room.activeFeatures.adventureLobby = msg;
  }
  if (action === "adventure_lobby_start" || action === "adventure_lobby_cancel") delete room.activeFeatures.adventureLobby;
  if (action === "adventure_lockstep_choice") room.activeFeatures.adventureLockstep = msg;
  if (action === "adventure_lobby_cancel") delete room.activeFeatures.adventureLockstep;
  if (action === "pvp_duel_request" || action === "pvp_duel_accept") room.activeFeatures.pvpDuel = msg;
  if (action === "pvp_duel_result" || action === "pvp_duel_reject") delete room.activeFeatures.pvpDuel;
  if (action === "frontier_boss_lobby_open" || action === "frontier_boss_lobby_ready") room.activeFeatures.bossLobby = msg;
  if (action === "frontier_boss_lobby_start" || action === "frontier_boss_lobby_cancel") delete room.activeFeatures.bossLobby;
  if (action === "frontier_boss_spawn") room.activeFeatures.frontierBoss = msg;
  if (["frontier_boss_damage", "frontier_boss_defeated"].includes(action) && room.activeFeatures.frontierBoss?.payload?.boss) {
    const boss = room.activeFeatures.frontierBoss.payload.boss;
    boss.hp = Math.max(0, Number(boss.hp || 0) - Math.max(0, Number(msg.payload?.damage || 0)));
    boss.defeated = boss.hp <= 0;
    msg.payload = { ...(msg.payload || {}), hp: boss.hp, totalHp: boss.totalHp, defeated: boss.defeated };
  }
  if (action === "frontier_boss_defeated" || action === "frontier_boss_expire") delete room.activeFeatures.frontierBoss;
  if (action === "overseas_boss_spawn") room.activeFeatures.overseasBoss = msg;
  if (["overseas_boss_damage", "overseas_boss_defeated"].includes(action) && room.activeFeatures.overseasBoss?.payload?.boss) {
    const boss = room.activeFeatures.overseasBoss.payload.boss;
    boss.hp = Math.max(0, Number(boss.hp || 0) - Math.max(0, Number(msg.payload?.damage || 0)));
    boss.defeated = boss.hp <= 0;
    msg.payload = { ...(msg.payload || {}), hp: boss.hp, totalHp: boss.totalHp, defeated: boss.defeated };
  }
  if (action === "overseas_boss_expire") delete room.activeFeatures.overseasBoss;
  if (action === "overseas_lobby_open") room.activeFeatures.overseasLobby = msg;
  if (action === "overseas_lobby_ready" && room.activeFeatures.overseasLobby?.payload?.lobby) {
    const lobby = room.activeFeatures.overseasLobby.payload.lobby;
    const participant = msg.payload?.participant;
    if (participant?.id) {
      lobby.participants = lobby.participants || {};
      lobby.participants[participant.id] = participant;
    }
  }
  if (action === "overseas_lobby_start" || action === "overseas_lobby_cancel") delete room.activeFeatures.overseasLobby;
  if (action === "overseas_council_open") room.activeFeatures.overseasCouncil = msg;
  if (action === "overseas_council_vote" && room.activeFeatures.overseasCouncil?.payload?.council) {
    const council = room.activeFeatures.overseasCouncil.payload.council;
    council.votes = council.votes || {};
    council.votes[msg.sourceId] = msg.payload?.vote;
  }
  if (action === "overseas_council_result" || action === "overseas_council_cancel") delete room.activeFeatures.overseasCouncil;
  if (action === "overseas_trade_open") room.activeFeatures.overseasTrade = msg;
  if (action === "overseas_trade_contribute" && room.activeFeatures.overseasTrade?.payload?.tradeRoute) {
    const tradeRoute = room.activeFeatures.overseasTrade.payload.tradeRoute;
    tradeRoute.contributions = tradeRoute.contributions || {};
    tradeRoute.contributions[msg.sourceId] = msg.payload?.contribution;
  }
  if (action === "overseas_trade_result" || action === "overseas_trade_cancel") delete room.activeFeatures.overseasTrade;
  if (action === "trade_request" && trade?.id) room.activeFeatures[`trade:${trade.id}`] = msg;
  if (["trade_accept", "trade_reject", "trade_cancel"].includes(action) && (trade?.id || msg.payload?.tradeId)) {
    delete room.activeFeatures[`trade:${trade?.id || msg.payload.tradeId}`];
  }
  if (action === "alliance_request" && msg.sourceId && msg.payload?.targetId) {
    room.activeFeatures[`alliance:${msg.sourceId}:${msg.payload.targetId}`] = msg;
  }
  if (action === "alliance_accept" && msg.sourceId && msg.payload?.targetId) {
    delete room.activeFeatures[`alliance:${msg.payload.targetId}:${msg.sourceId}`];
    delete room.activeFeatures[`alliance:${msg.sourceId}:${msg.payload.targetId}`];
  }
  if (action === "room_close_save") {
    room.snapshot = msg.payload?.snapshot || room.snapshot;
    room.roomSave = msg.payload || null;
    room.activeFeatures = {};
  }
}

function sendStatic(req, res) {
  if (!["GET", "HEAD"].includes(req.method || "GET")) {
    res.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed");
    return true;
  }
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const requested = path.normalize(path.join(STATIC_ROOT, pathname));
  if (!requested.startsWith(STATIC_ROOT)) {
    res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return true;
  }
  let filePath = requested;
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(STATIC_ROOT, "index.html");
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return false;
  const ext = path.extname(filePath).toLowerCase();
  const headers = {
    "content-type": mimeTypes[ext] || "application/octet-stream",
    "cache-control": [".html", ".js", ".css"].includes(ext) ? "no-cache" : "public, max-age=31536000, immutable",
    "access-control-allow-origin": "*",
  };
  res.writeHead(200, headers);
  if (req.method === "HEAD") {
    res.end();
    return true;
  }
  fs.createReadStream(filePath).pipe(res);
  return true;
}

function handleReady(room, clientId, player) {
  const current = room.players.get(clientId) || {};
  const readyYear = Number(player.readyYear || current.readyYear || player.year || current.year || 0);
  room.players.set(clientId, { ...current, ...player, id: clientId, online: true, ready: true, readyYear });
  broadcastRoomState(room);
  const online = players(room).filter((item) => item.online !== false);
  const founded = online.filter((item) => item.founded);
  const eligible = founded.length ? founded : online;
  if (
    readyYear > 0 &&
    eligible.length > 0 &&
    eligible.every((item) => item.ready && Number(item.readyYear || 0) === readyYear)
  ) {
    const readyPlayers = players(room);
    broadcast(room, { type: "all_ready", year: readyYear, players: readyPlayers });
    for (const item of eligible) {
      const currentPlayer = room.players.get(item.id);
      if (currentPlayer && Number(currentPlayer.readyYear || 0) === readyYear) {
        room.players.set(item.id, { ...currentPlayer, ready: false, readyYear: 0, activity: "进入下一年结算" });
      }
    }
    broadcastRoomState(room);
  }
}

const server = http.createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, rooms: rooms.size }));
    return;
  }
  if (sendStatic(req, res)) return;
  res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
  res.end("Sect simulator WebSocket room server. Use /ws?room=ROOM_CODE");
});

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (ws, req) => {
  const url = new URL(req.url || "/ws", `http://${req.headers.host || "localhost"}`);
  const room = roomFor(url.searchParams.get("room"));
  let clientId = "";
  ws.isAlive = true;
  ws.on("pong", () => { ws.isAlive = true; });
  room.updatedAt = Date.now();

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(String(raw));
    } catch {
      return;
    }
    clientId = msg.clientId || clientId;
    if (!clientId) return;
    room.clients.set(clientId, ws);
    refreshHost(room);

    if (msg.type === "join") {
      const player = { ...(msg.player || {}), id: clientId, online: true, ready: false };
      room.players.set(clientId, player);
      safeSend(ws, { type: "welcome", host: room.hostId === clientId });
      if (room.snapshot) safeSend(ws, { type: "world_snapshot", sourceId: "server", snapshot: room.snapshot });
      if (room.roomSave) safeSend(ws, { type: "room_feature", sourceId: "server", sourceName: "房间服务器", action: "room_save_available", payload: room.roomSave });
      for (const feature of Object.values(room.activeFeatures)) safeSend(ws, feature);
      broadcastRoomState(room);
      return;
    }

    if (msg.type === "public_state") {
      const current = room.players.get(clientId) || {};
      room.players.set(clientId, { ...current, ...(msg.player || {}), id: clientId, online: true });
      broadcastRoomState(room);
      return;
    }

    if (msg.type === "ready") {
      handleReady(room, clientId, msg.player || {});
      return;
    }

    if (msg.type === "world_snapshot") {
      room.snapshot = msg.snapshot || null;
      broadcast(room, { ...msg, sourceId: clientId }, clientId);
      return;
    }

    if (msg.type === "room_feature") {
      const outgoing = { ...msg, sourceId: msg.sourceId || clientId };
      cacheFeature(room, outgoing);
      broadcast(room, outgoing, clientId);
      if (["frontier_boss_damage", "frontier_boss_defeated", "overseas_boss_damage", "overseas_boss_defeated"].includes(outgoing.action)) {
        safeSend(ws, { ...outgoing, sourceId: "server", payload: { ...(outgoing.payload || {}), authoritativeOnly: true } });
      }
      return;
    }

    if (["player_event", "pvp_report", "forbidden_progress"].includes(msg.type)) {
      broadcast(room, { ...msg, sourceId: clientId }, clientId);
    }
  });

  ws.on("close", () => {
    if (!clientId) return;
    room.clients.delete(clientId);
    const player = room.players.get(clientId);
    if (player) room.players.set(clientId, { ...player, online: false, ready: false, activity: "离线" });
    refreshHost(room);
    migrateOverseasFeatureHosts(room, clientId);
    broadcastRoomState(room);
  });
});

const heartbeat = setInterval(() => {
  for (const ws of wss.clients) {
    if (ws.isAlive === false) {
      ws.terminate();
      continue;
    }
    ws.isAlive = false;
    ws.ping();
  }
}, 25000);
heartbeat.unref();

setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (!room.clients.size && now - room.updatedAt > 1000 * 60 * 60 * 6) rooms.delete(code);
  }
}, 1000 * 60 * 20).unref();

server.listen(PORT, () => {
  console.log(`Sect room server listening on ${PORT}`);
});
