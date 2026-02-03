import { ORPCError, os } from "@orpc/server"
import type { Context } from "../types"
import { API_KEY_HEADER } from "../../constants"
import { auth } from "../lib/auth"

export const authMiddleware = os.$context<Context>().middleware(({ context, next }) => {
  const headerApiKey = context.req.headers[API_KEY_HEADER]
  const secretKey = context.secretKey

  if (!secretKey) return next()

  if (typeof headerApiKey !== "string") {
    throw new ORPCError("UNAUTHORIZED", {
      message: `${API_KEY_HEADER} header is missing`,
    })
  }

  const isValidApiKey = auth.isValidApiKey(secretKey, headerApiKey)

  if (!isValidApiKey) {
    throw new ORPCError("UNAUTHORIZED", {
      message: `Invalid ${API_KEY_HEADER}`,
    })
  }

  return next()
})
