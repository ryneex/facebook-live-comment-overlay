import { command, run, option, number, string, optional } from "cmd-ts"
import { startServer } from "./server"
import { getVariables } from "./helpers/get-variables"

const app = command({
  name: "Server",
  description: "Server for the Facebook live comment overlay",
  args: {
    port: option({
      long: "port",
      type: number,
      defaultValue: () => 3000,
      description: "Port to listen on",
    }),
    secret: option({
      long: "secret",
      type: optional(string),
      description: "Secret to authenticate requests",
    }),
    host: option({
      long: "host",
      type: string,
      defaultValue: () => "0.0.0.0",
      description: "Host to listen on",
    }),
  },
  handler(args) {
    const variables = getVariables(args)
    startServer(variables)
  },
})

run(app, process.argv.slice(2))
