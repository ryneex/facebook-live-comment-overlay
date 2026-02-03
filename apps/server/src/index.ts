import { command, run, option, number, string, optional } from "cmd-ts"
import { startServer } from "./server"

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
    secret: option({
      short: "s",
      long: "secret",
      type: optional(string),
      description: "Secret to authenticate requests",
    }),
    host: option({
      short: "h",
      long: "host",
      type: string,
      defaultValue: () => "0.0.0.0",
      description: "Host to listen on",
    }),
  },
  handler(args) {
    startServer(args)
  },
})

run(app, process.argv.slice(2))
