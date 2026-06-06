const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const port = Number(process.env.PORT || process.argv.find((arg) => arg.startsWith("--port="))?.split("=")[1] || 8097);
const rooms = new Map();
const DISCONNECT_GRACE_MS = 60000;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: true, rooms: rooms.size }));
    return;
  }
  let filePath = path.normalize(path.join(root, decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname)));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

server.on("upgrade", (req, socket) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (url.pathname !== "/ws") {
    socket.destroy();
    return;
  }
  const key = req.headers["sec-websocket-key"];
  if (!key) {
    socket.destroy();
    return;
  }
  const accept = crypto.createHash("sha1").update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`).digest("base64");
  socket.write([
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${accept}`,
    "",
    "",
  ].join("\r\n"));

  const roomCode = cleanRoom(url.searchParams.get("room") || "ZIHE01");
  const client = { socket, roomCode, id: "", buffer: Buffer.alloc(0) };
  socket.on("data", (chunk) => handleChunk(client, chunk));
  socket.on("close", () => removeClient(client));
  socket.on("error", () => removeClient(client));
});

function cleanRoom(room) {
  return String(room || "ZIHE01").toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 16) || "ZIHE01";
}

function getRoom(roomCode) {
  if (!rooms.has(roomCode)) rooms.set(roomCode, { code: roomCode, players: new Map(), year: 1 });
  return rooms.get(roomCode);
}

function handleChunk(client, chunk) {
  client.buffer = Buffer.concat([client.buffer, chunk]);
  while (client.buffer.length) {
    const frame = decodeFrame(client.buffer);
    if (!frame) return;
    client.buffer = frame.rest;
    if (frame.close) {
      client.socket.end();
      return;
    }
    if (frame.text) {
      try {
        handleMessage(client, JSON.parse(frame.text));
      } catch (err) {
        send(client.socket, { type: "error", message: "Bad message" });
      }
    }
  }
}

function decodeFrame(buffer) {
  if (buffer.length < 2) return null;
  const opcode = buffer[0] & 0x0f;
  const masked = Boolean(buffer[1] & 0x80);
  let length = buffer[1] & 0x7f;
  let offset = 2;
  if (length === 126) {
    if (buffer.length < offset + 2) return null;
    length = buffer.readUInt16BE(offset);
    offset += 2;
  } else if (length === 127) {
    if (buffer.length < offset + 8) return null;
    const high = buffer.readUInt32BE(offset);
    const low = buffer.readUInt32BE(offset + 4);
    length = high * 2 ** 32 + low;
    offset += 8;
  }
  const maskOffset = masked ? 4 : 0;
  if (buffer.length < offset + maskOffset + length) return null;
  let payload = buffer.subarray(offset + maskOffset, offset + maskOffset + length);
  if (masked) {
    const mask = buffer.subarray(offset, offset + 4);
    payload = Buffer.from(payload.map((byte, i) => byte ^ mask[i % 4]));
  }
  return {
    close: opcode === 8,
    text: opcode === 1 ? payload.toString("utf8") : "",
    rest: buffer.subarray(offset + maskOffset + length),
  };
}

function encodeFrame(text) {
  const payload = Buffer.from(JSON.stringify(text));
  if (payload.length < 126) return Buffer.concat([Buffer.from([0x81, payload.length]), payload]);
  if (payload.length < 65536) {
    const head = Buffer.alloc(4);
    head[0] = 0x81;
    head[1] = 126;
    head.writeUInt16BE(payload.length, 2);
    return Buffer.concat([head, payload]);
  }
  const head = Buffer.alloc(10);
  head[0] = 0x81;
  head[1] = 127;
  head.writeUInt32BE(0, 2);
  head.writeUInt32BE(payload.length, 6);
  return Buffer.concat([head, payload]);
}

function send(socket, payload) {
  if (socket && !socket.destroyed) {
    try {
      socket.write(encodeFrame(payload));
    } catch {
      socket.destroy();
    }
  }
}

function broadcast(room, payload) {
  for (const player of room.players.values()) send(player.socket, payload);
}

function publicPlayers(room) {
  return [...room.players.values()].map((player) => ({
    ...player.publicState,
    id: player.id,
    connected: Boolean(player.connected),
    ready: Boolean(player.ready),
    forbiddenFloor: player.forbiddenFloor || player.publicState?.forbiddenFloor || 0,
  }));
}

function maybeAdvanceRoom(room, roomCode) {
  const players = [...room.players.values()];
  if (players.length && players.every((item) => item.ready)) {
    room.year += 1;
    broadcast(room, { type: "all_ready", roomCode, year: room.year, players: publicPlayers(room) });
    for (const item of players) {
      item.ready = false;
      item.forbiddenFloor = 0;
      item.publicState = { ...item.publicState, ready: false, forbiddenFloor: 0, year: room.year };
    }
    setTimeout(() => broadcastRoomState(room), 120);
  }
}

function handleMessage(client, msg) {
  const roomCode = cleanRoom(msg.roomCode || client.roomCode);
  const room = getRoom(roomCode);
  if (msg.type === "join") {
    const id = String(msg.clientId || msg.player?.id || crypto.randomUUID());
    const old = room.players.get(id);
    if (old?.socket && old.socket !== client.socket) old.socket.destroy();
    if (old?.disconnectTimer) clearTimeout(old.disconnectTimer);
    client.id = id;
    client.roomCode = roomCode;
    const host = ![...room.players.values()].some((player) => player.id !== id);
    room.players.set(id, {
      id,
      socket: client.socket,
      publicState: { ...(old?.publicState || {}), ...(msg.player || {}), id },
      ready: Boolean(old?.ready || msg.player?.ready),
      forbiddenFloor: Number(old?.forbiddenFloor || msg.player?.forbiddenFloor || 0),
      joinedAt: old?.joinedAt || Date.now(),
      lastSeen: Date.now(),
      connected: true,
      disconnectTimer: null,
    });
    send(client.socket, { type: "welcome", clientId: id, roomCode, host });
    broadcast(room, { type: "player_event", text: `${msg.player?.name || "一名玩家"}进入联机房间。`, tone: "good" });
    broadcastRoomState(room);
    return;
  }
  const player = room.players.get(client.id || msg.clientId);
  if (!player) return;
  player.lastSeen = Date.now();
  if (msg.type === "pong") return;
  if (msg.type === "public_state" && msg.player) {
    player.publicState = { ...player.publicState, ...msg.player, id: player.id };
    player.forbiddenFloor = msg.player.forbiddenFloor || 0;
    broadcastRoomState(room);
  }
  if (msg.type === "forbidden_progress") {
    player.forbiddenFloor = Number(msg.floor || msg.player?.forbiddenFloor || 0);
    if (msg.player) player.publicState = { ...player.publicState, ...msg.player, id: player.id };
    broadcastRoomState(room);
  }
  if (msg.type === "ready") {
    player.ready = true;
    player.publicState = { ...player.publicState, ...(msg.player || {}), id: player.id, ready: true };
    broadcastRoomState(room);
    maybeAdvanceRoom(room, roomCode);
  }
  if (msg.type === "pvp_report" && msg.report) {
    broadcast(room, { type: "pvp_report", report: msg.report });
  }
  if (msg.type === "world_snapshot" && msg.snapshot) {
    broadcast(room, { type: "world_snapshot", sourceId: player.id, snapshot: msg.snapshot });
  }
}

function broadcastRoomState(room) {
  broadcast(room, { type: "room_state", roomCode: room.code, year: room.year, players: publicPlayers(room) });
}

function removeClient(client) {
  if (!client.id) return;
  const room = rooms.get(client.roomCode);
  if (!room) return;
  const player = room.players.get(client.id);
  if (player?.socket === client.socket) {
    player.socket = null;
    player.connected = false;
    player.lastSeen = Date.now();
    player.disconnectTimer = setTimeout(() => {
      const current = room.players.get(client.id);
      if (!current || current.connected) return;
      room.players.delete(client.id);
      broadcast(room, { type: "player_event", text: `${current.publicState?.name || "一名玩家"}离开联机房间。`, tone: "warn" });
      broadcastRoomState(room);
      maybeAdvanceRoom(room, client.roomCode);
      if (room.players.size === 0) rooms.delete(client.roomCode);
    }, DISCONNECT_GRACE_MS);
    broadcast(room, { type: "player_event", text: `${player.publicState?.name || "一名玩家"}连接短暂中断，正在等待重连。`, tone: "warn" });
    broadcastRoomState(room);
  }
}

setInterval(() => {
  const now = Date.now();
  for (const room of rooms.values()) {
    for (const player of room.players.values()) {
      send(player.socket, { type: "heartbeat", t: now });
    }
  }
}, 25000);

server.listen(port, "0.0.0.0", () => {
  console.log(`Cultivation Sect Sim server running on 0.0.0.0:${port}`);
});
