import { useCallback, useState } from "react"
import type { Reply } from "../types"
import { loadReplies, saveReplies } from "../lib/storage"

/**
 * 返信の一覧と、追加操作をまとめたフック。
 * 変更するたびに localStorage に書き込む。
 */
export function useReplies() {
  const [replies, setReplies] = useState<Reply[]>(() => loadReplies())

  const addReply = useCallback((reply: Reply) => {
    setReplies((prev) => {
      const next = [...prev, reply]
      saveReplies(next)
      return next
    })
  }, [])

  return { replies, addReply }
}
