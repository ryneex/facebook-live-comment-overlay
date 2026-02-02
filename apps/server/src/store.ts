import type { Comment } from "./contract"

export const store = {
  comments: [] as Comment[],
  replaceComments: (comments: Comment[]) => {
    store.comments = comments
  },
}
