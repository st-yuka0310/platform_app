/**
 * 「自分の投稿に返信が来たら」だけをトリガーにした、最小限の通知。
 * サーバーを持たないのでプッシュ通知はできない。ログインしたときに、
 * 自分の投稿への返信を数えて知らせるだけの、その場限りの仕組み。
 */
import type { Post, Reply } from "../types"

export interface Notification {
  reply: Reply
  post: Post
}

/** 自分の投稿に付いた、自分以外からの返信を新しい順に集める */
export function collectNotifications(
  posts: Post[],
  replies: Reply[],
  viewerId: string,
): Notification[] {
  const myPostIds = new Set(
    posts.filter((p) => p.authorId === viewerId).map((p) => p.id),
  )
  return replies
    .filter((r) => myPostIds.has(r.postId) && r.authorId !== viewerId)
    .map((r) => {
      const post = posts.find((p) => p.id === r.postId)
      return post ? { reply: r, post } : null
    })
    .filter((n): n is Notification => n !== null)
    .sort((a, b) => b.reply.createdAt.localeCompare(a.reply.createdAt))
}

// 「どこまで見たか」を利用者ごとに覚えておく。視点を切り替えても
// （＝別の利用者としてログインし直しても）互いの既読状態を混同しないため。
const SEEN_KEY = "platform_app:notifications_seen"

function loadSeenMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

/** まだ見ていない通知なら true。一度も開いたことがない利用者は、今ある分すべてが未読扱い */
export function isUnseen(viewerId: string, reply: Reply): boolean {
  const lastSeenAt = loadSeenMap()[viewerId]
  if (!lastSeenAt) return true
  return reply.createdAt > lastSeenAt
}

/** 通知欄を開いたときに呼び、その時点までを既読にする */
export function markAllSeen(viewerId: string): void {
  const map = loadSeenMap()
  map[viewerId] = new Date().toISOString()
  localStorage.setItem(SEEN_KEY, JSON.stringify(map))
}
