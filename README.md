# Render backend deploy

This is the WebSocket room server for the cultivation simulator.

Render settings:

- Build Command: `npm install`
- Start Command: `npm start`
- Environment: Node

Frontend `config.js` should keep:

```js
window.SECT_BACKEND_URL = "https://your-render-service.onrender.com";
```

The frontend connects to:

```text
wss://your-render-service.onrender.com/ws?room=ROOM_CODE
```

