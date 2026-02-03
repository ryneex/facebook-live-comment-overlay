import type { WebSocketServer } from "ws"
import type { IncomingMessage, ServerResponse } from "node:http"

export type Context = {
  wss: WebSocketServer
  req: IncomingMessage
  res: ServerResponse<IncomingMessage>
  secretKey?: string
}
