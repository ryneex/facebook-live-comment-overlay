import { router } from "./routes/router"
import { OpenAPIHandler } from "@orpc/openapi/node"
import { CORSPlugin } from "@orpc/server/plugins"
import { WebSocketServer } from "ws"
import { createServer } from "node:http"
import serveStatic from "serve-static"
import path from "node:path"
import { store } from "./memory/store"
import { API_KEY_HEADER } from "../constants"
import { auth } from "./lib/auth"

type Args = {
  port: number
  secret?: string
  host?: string
}

export function startServer(args: Args) {
  const server = createServer()
  const orpcHandler = new OpenAPIHandler(router, { plugins: [new CORSPlugin()] })
  const serve = serveStatic(path.resolve(import.meta.dirname, "./overlay"))

  const wss = new WebSocketServer({ path: "/api/ws", noServer: true })

  wss.on("connection", (socket) => {
    socket.send(JSON.stringify({ type: "comments", data: store.comments }))
  })

  server.on("request", async (req, res) => {
    const { matched } = await orpcHandler.handle(req, res, {
      context: {
        wss,
        req,
        res,
        secretKey: args.secret,
      },
      prefix: "/api",
    })

    if (matched) return

    serve(req, res, () => {
      res.end("Not found")
    })
  })

  server.on("upgrade", (req, socket, head) => {
    function handleUpgrade() {
      wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req))
    }

    const appSecretKey = args.secret
    const headerApiKey = req.headers[API_KEY_HEADER]

    if (!appSecretKey) return handleUpgrade()

    if (typeof headerApiKey !== "string") {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n")
      socket.destroy()
      return
    }

    const isValidApiKey = auth.isValidApiKey(appSecretKey, headerApiKey)

    if (!isValidApiKey) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n")
      socket.destroy()
      return
    }

    return handleUpgrade()
  })

  server.listen(args.port, args.host, () => {
    console.log(`Server is running on port ${args.port}`)
  })
}
