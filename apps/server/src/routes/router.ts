import { implement } from "@orpc/server"
import { contract } from "./contract"
import { store } from "../memory/store"
import type { Context } from "../types"
import { authMiddleware } from "../middlewares/auth.middleware"

const os = implement(contract).$context<Context>().use(authMiddleware)

export const router = os.router({
  health: os.health.handler(() => {
    return {
      status: "OK",
    }
  }),

  comments: os.comments.handler(({ context, input }) => {
    context.wss.clients.forEach((client) => {
      store.replaceComments(input)
      client.send(JSON.stringify({ type: "comments", data: input }))
    })

    return input
  }),
})
