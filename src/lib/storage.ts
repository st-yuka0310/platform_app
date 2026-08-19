/**
 * サーバーもデータベースも用意しない（企画書 §10）代わりに、
 * その場で書いた投稿と返信だけをブラウザの localStorage に残す。
 *
 * ラベル・利用者・お知らせは編集する画面を作らないので、
 * ここでは永続化せず常にサンプルデータをそのまま使う。
 */
import type { Post, Reply } from "../types"
import { samplePosts } from "../data/posts"
import { sampleReplies } from "../data/replies"

const STORAGE_KEYS = {
  posts: "platform_app:posts",
  replies: "platform_app:replies",
} as const

function loadOrSeed<T>(key: string, seed: T[]): T[] {
  const raw = localStorage.getItem(key)
  if (raw !== null) {
    try {
      return JSON.parse(raw) as T[]
    } catch {
      // 壊れたデータが入っていた場合はサンプルに戻す
    }
  }
  localStorage.setItem(key, JSON.stringify(seed))
  return seed
}

export function loadPosts(): Post[] {
  return loadOrSeed(STORAGE_KEYS.posts, samplePosts)
}

export function savePosts(posts: Post[]): void {
  localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts))
}

export function loadReplies(): Reply[] {
  return loadOrSeed(STORAGE_KEYS.replies, sampleReplies)
}

export function saveReplies(replies: Reply[]): void {
  localStorage.setItem(STORAGE_KEYS.replies, JSON.stringify(replies))
}

/** デモの前などに、最初のサンプルデータの状態へ戻す */
export function resetToSampleData(): void {
  localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(samplePosts))
  localStorage.setItem(STORAGE_KEYS.replies, JSON.stringify(sampleReplies))
}
