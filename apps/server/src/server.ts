import { router } from "./routes/router"
import { OpenAPIHandler } from "@orpc/openapi/node"
import { CORSPlugin } from "@orpc/server/plugins"
import { WebSocketServer } from "ws"
import { createServer } from "node:http"
import serveStatic from "serve-static"
import path from "node:path"
import pc from "picocolors"
import { store } from "./memory/store"
import { auth } from "./lib/auth"
import type { Variables } from "./types"

export function startServer(args: Variables) {
  const { baseUrl, host, port, secretKey } = args

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
        secretKey,
      },
      prefix: "/api",
    })

    if (matched) return

    serve(req, res, () => {
      res.end("Not found")
    })
  })

  server.on("upgrade", (req, socket, head) => {
    const url = new URL(`http://${host}:${port}${req.url}`)

    function handleUpgrade() {
      wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req))
    }

    if (!secretKey) return handleUpgrade()

    const apiKey = url.searchParams.get("key")
    if (!apiKey) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n")
      socket.destroy()
      return
    }

    const isValidApiKey = auth.isValidApiKey(secretKey, apiKey)

    if (!isValidApiKey) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n")
      socket.destroy()
      return
    }

    return handleUpgrade()
  })

  server.listen(args.port, args.host, () => {
    console.log()
    console.log(pc.bold(pc.green("✓ Overlay server is running")))
    console.log()
    console.log(pc.dim("  Host:") + ` ${host}`)
    console.log(pc.dim("  Port:") + ` ${port}`)

    if (secretKey) {
      const apiKey = auth.generateApiKey(secretKey)
      const overlayUrl = `${baseUrl}?key=${apiKey}`
      console.log()
      console.log(pc.yellow("  ⚠  API authentication enabled - overlay will only work with this key"))
      console.log()
      console.log(pc.dim("  API Key:") + ` ${pc.cyan(apiKey)}`)
      console.log(pc.dim("  Overlay URL:") + ` ${pc.cyan(overlayUrl)}`)
    } else {
      console.log()
      console.log(pc.yellow("  ⚠  No secret provided - API authentication disabled"))
      console.log()
      console.log(pc.dim("  Overlay URL:") + ` ${pc.cyan(baseUrl)}`)
    }
    console.log(pc.dim("  API URL:") + ` ${pc.cyan(`${baseUrl}/api`)}`)
    console.log(pc.dim("  WebSocket URL:") + ` ${pc.cyan(`${baseUrl}/api/ws`)}`)

    console.log()
  })
}
