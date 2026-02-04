import { env } from "../lib/env"
import type { CliArgs, Variables } from "../types"

export function getVariables(args: CliArgs): Variables {
  return {
    port: env.PORT ? parseInt(env.PORT) : args.port,
    host: env.HOST || args.host,
    secretKey: env.SECRET_KEY,
    baseUrl: env.BASE_URL || `http://${args.host}:${args.port}`,
  }
}
