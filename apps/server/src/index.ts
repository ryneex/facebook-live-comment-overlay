import { router } from "./router"
import { OpenAPIHandler } from "@orpc/openapi/node"
import { CORSPlugin } from "@orpc/server/plugins"
import { WebSocketServer } from "ws"
import { createServer } from "node:http"
import serveStatic from "serve-static"
import path from "node:path"

const server = createServer()
const orpcHandler = new OpenAPIHandler(router, { plugins: [new CORSPlugin()] })
const serve = serveStatic(path.resolve(import.meta.dirname, "./overlay"))

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

  serve(req, res, () => {
    res.end("Not found")
  })
})

server.listen(3000, () => {
  console.log("Server is running on port 3000")
})
