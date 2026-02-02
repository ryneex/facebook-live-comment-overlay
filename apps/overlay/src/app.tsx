import useWebSocket from "react-use-websocket"
import { WEBSOCKET_URL } from "./constants/websocket"
import z from "zod"
import { useEffect, useRef, useState } from "react"
import uniqolor from "uniqolor"

const CommentSchema = z.object({
  image: z.url(),
  author: z.string(),
  comment: z.string(),
})

type Comment = z.infer<typeof CommentSchema>

const WebSocketMessageSchema = z.object({
  type: z.literal("comments"),
  data: z.array(CommentSchema),
})

export function App() {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [comments, setComments] = useState<Comment[]>([])

  useWebSocket(WEBSOCKET_URL, {
    retryOnError: true,
    shouldReconnect: () => true,
    onMessage: (event) => {
      const result = WebSocketMessageSchema.parse(JSON.parse(event.data))
      setComments(result.data)
    },
  })

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current?.scrollHeight,
      behavior: "smooth",
    })
  }, [comments])

  return (
    <div className="wrapper dark h-screen w-screen overflow-hidden">
      <div ref={chatContainerRef} className="chat-container hide-scrollbar flex size-full flex-col gap-2 overflow-auto">
        {comments.map((comment, index) => {
          const color = uniqolor(comment.author).color

          return (
            <div className="chat" key={index}>
              <p style={{ color }} className="chat-author mr-2 inline-block text-sm font-medium">
                <img
                  className="chat-author-avatar mr-2 inline size-4 rounded-full object-cover"
                  src={comment.image}
                  alt={comment.author}
                />
                <span
                  className="chat-author-name font-bold"
                  style={{
                    textShadow: `0 0 10px ${color}`,
                  }}
                >
                  {comment.author}
                </span>
                {" :"}
              </p>
              <p className="chat-comment inline text-sm text-white/90">{comment.comment}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
