import { implement } from "@orpc/server"
import { contract } from "./contract"
import type { WebSocketServer } from "ws"

const os = implement(contract).$context<{ ws: WebSocketServer }>()

export const router = os.router({
  health: os.health.handler(() => {
    return {
      status: "OK",
    }
  }),

  comments: os.comments.handler(({ context, input }) => {
    context.ws.clients.forEach((client) => {
      client.send(JSON.stringify(input))
    })

    return input
  }),
})
