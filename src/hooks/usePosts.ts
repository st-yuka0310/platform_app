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

  // patch に updatedAt を含めなければ、ここで「今」を最終編集日時として補う。
  // 状態の変更（PostCard）も本文の編集（投稿を編集）も、どちらもこの1箇所を通る。
  const updatePost = useCallback((id: string, patch: Partial<Post>) => {
    setPosts((prev) => {
      const next = prev.map((p) =>
        p.id === id
          ? { ...p, ...patch, updatedAt: patch.updatedAt ?? new Date().toISOString() }
          : p,
      )
      savePosts(next)
      return next
    })
  }, [])

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => {
      const next = prev.filter((p) => p.id !== id)
      savePosts(next)
      return next
    })
  }, [])

  return { posts, addPost, updatePost, deletePost }
}
