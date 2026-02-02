import { router } from "./router"
import { OpenAPIHandler } from "@orpc/openapi/node"
import { WebSocketServer } from "ws"
import { createServer } from "node:http"

const server = createServer()
const orpcHandler = new OpenAPIHandler(router)

const ws = new WebSocketServer({
  path: "/api/ws",
  server,
})

server.on("request", async (req, res) => {
  const { matched } = await orpcHandler.handle(req, res, {
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
