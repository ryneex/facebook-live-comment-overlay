import { env } from "../lib/env"
import type { CliArgs, Variables } from "../types"

export function getVariables(args: CliArgs): Variables {
  return {
    host: args.host,
    port: args.port,
    baseUrl: env.BASE_URL || `http://${args.host}:${args.port}`,
    secretKey: env.SECRET_KEY,
  }
}
