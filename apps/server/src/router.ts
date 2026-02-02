import { implement } from "@orpc/server"
import { contract } from "./contract"
import type { WebSocketServer } from "ws"
import { store } from "./store"

const os = implement(contract).$context<{ ws: WebSocketServer }>()

export const router = os.router({
  health: os.health.handler(() => {
    return {
      status: "OK",
    }
  }),

  comments: os.comments.handler(({ context, input }) => {
    context.ws.clients.forEach((client) => {
      store.replaceComments(input)
      client.send(JSON.stringify({ type: "comments", data: input }))
    })

    return input
  }),
})
