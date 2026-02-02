import { oc } from "@orpc/contract"
import z from "zod"

const CommentSchema = z.object({
  image: z.url(),
  author: z.string(),
  comment: z.string(),
})

export type Comment = z.infer<typeof CommentSchema>

export const contract = oc.router({
  health: oc
    .route({
      path: "/health",
      method: "GET",
    })
    .output(
      z.object({
        status: z.literal("OK"),
      }),
    ),

  comments: oc
    .route({
      path: "/comments",
      method: "POST",
    })
    .input(z.array(CommentSchema))
    .output(z.array(CommentSchema)),
})
