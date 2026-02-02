let WEBSOCKET_URL = ""

if (import.meta.env.DEV) {
  WEBSOCKET_URL = "ws://localhost:3000/api/ws"
} else {
  WEBSOCKET_URL = "/api/ws"
}

export { WEBSOCKET_URL }
