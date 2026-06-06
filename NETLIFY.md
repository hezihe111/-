# Netlify deploy notes

Netlify can host the game frontend as a static site. The multiplayer room server
uses WebSocket and must run on a separate always-on Node host, such as Render,
Railway, Fly.io, a VPS, or the current temporary tunnel.

## Static frontend

Upload these files to Netlify Drop or deploy the repo with `netlify.toml`:

- `index.html`
- `app.js`
- `styles.css`
- `config.js`
- `assets/`
- `netlify.toml`

## Multiplayer backend

Deploy the full Node app somewhere that supports WebSocket:

- `server.js`
- `package.json`
- `assets/`
- frontend files are optional when using Netlify for the frontend

After the backend is online, edit `config.js` in the Netlify frontend:

```js
window.SECT_BACKEND_URL = "https://your-websocket-backend.example.com";
```

The client will connect to:

```text
wss://your-websocket-backend.example.com/ws?room=ROOM_CODE
```

For quick testing, you can also append a backend query parameter:

```text
https://your-netlify-site.netlify.app/?backend=https://your-websocket-backend.example.com
```
