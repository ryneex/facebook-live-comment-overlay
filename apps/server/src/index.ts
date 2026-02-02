import { router } from "./router"
import { OpenAPIHandler } from "@orpc/openapi/node"
import { CORSPlugin } from "@orpc/server/plugins"
import { WebSocketServer } from "ws"
import { createServer } from "node:http"
import serveStatic from "serve-static"
import path from "node:path"
import { store } from "./store"
import { command, run, option, number } from "cmd-ts"

type Args = {
  port: number
}

function main(args: Args) {
  const server = createServer()
  const orpcHandler = new OpenAPIHandler(router, { plugins: [new CORSPlugin()] })
  const serve = serveStatic(path.resolve(import.meta.dirname, "./overlay"))

  const ws = new WebSocketServer({
    path: "/api/ws",
    server,
  })

  ws.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "comments", data: store.comments }))
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

  server.listen(args.port, () => {
    console.log(`Server is running on port ${args.port}`)
  })
}

const app = command({
  name: "Server",
  description: "Server for the Facebook live comment overlay",
  args: {
    port: option({
      short: "p",
      long: "port",
      type: number,
      defaultValue: () => 3000,
      description: "Port to listen on",
    }),
  },
  handler(args) {
    main(args)
  },
})

run(app, process.argv.slice(2))
