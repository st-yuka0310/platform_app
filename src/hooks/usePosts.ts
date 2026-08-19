import { useCallback, useState } from "react"
import type { Post } from "../types"
import { loadPosts, savePosts } from "../lib/storage"

/**
 * 投稿の一覧と、追加・更新の操作をまとめたフック。
 * 変更するたびに localStorage に書き込む。
 */
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(() => loadPosts())

  const addPost = useCallback((post: Post) => {
    setPosts((prev) => {
      const next = [post, ...prev]
      savePosts(next)
      return next
    })
  }, [])

  const updatePost = useCallback((id: string, patch: Partial<Post>) => {
    setPosts((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
      savePosts(next)
      return next
    })
  }, [])

  return { posts, addPost, updatePost }
}
