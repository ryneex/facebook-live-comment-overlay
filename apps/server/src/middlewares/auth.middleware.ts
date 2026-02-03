import { ORPCError, os } from "@orpc/server"
import type { Context } from "../types"

export const authMiddleware = os.$context<Context>().middleware(({ context, next }) => {
  const headerSecretKey = context.req.headers["x-secret-key"]
  const appSecretKey = context.secretKey

  if (!appSecretKey) return next()

  if (!headerSecretKey) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "X-Secret header is missing",
    })
  }

  if (appSecretKey !== headerSecretKey) {
    throw new ORPCError("UNAUTHORIZED", {
      message: "Invalid secret",
    })
  }

  return next()
})
