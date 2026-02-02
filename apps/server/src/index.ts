import { router } from "./router"
import { RPCHandler } from "@orpc/server/node"
import { WebSocketServer } from "ws"
import { createServer } from "node:http"
import serveStatic from "serve-static"

const server = createServer()
const rpcHandler = new RPCHandler(router)
// const serve = serveStatic("")

const ws = new WebSocketServer({
  path: "/api/ws",
  server,
})

server.on("request", async (req, res) => {
  const { matched } = await rpcHandler.handle(req, res, {
    context: {
      ws,
    },
    prefix: "/api",
  })

  if (matched) return

  res.end("Not found")
})

server.listen(3000, () => {
  console.log("Server is running on port 3000")
})
