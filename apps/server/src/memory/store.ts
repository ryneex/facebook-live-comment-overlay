import type { Comment } from "../routes/contract"

export const store = {
  comments: [] as Comment[],
  replaceComments: (comments: Comment[]) => {
    store.comments = comments
  },
}
