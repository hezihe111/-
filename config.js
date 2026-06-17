// Multiplayer backend.
// Netlify hosts the static frontend; Render hosts the WebSocket room server.
window.SECT_BACKEND_URL = "https://hzh11.onrender.com";
// Keep art assets on the current frontend origin. This makes local Codex
// preview and Netlify deploys load the bundled ./assets files directly.
window.SECT_ASSET_BASE = "";
