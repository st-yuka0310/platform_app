/**
 * 担当: C（非公開の返信、視点切り替え）
 *
 * 公開の返信は誰でも見られる。非公開の返信は、
 * 投稿者本人と、その返信を書いた人だけに見える（企画書 §7）。
 */
import type { Post, Reply } from "../types"

export function isReplyVisible(
  reply: Reply,
  viewerId: string,
  post: Post,
): boolean {
  if (!reply.isPrivate) return true
  return viewerId === post.authorId || viewerId === reply.authorId
}

export function visibleRepliesFor(
  replies: Reply[],
  post: Post,
  viewerId: string,
): Reply[] {
  return replies
    .filter((r) => r.postId === post.id)
    .filter((r) => isReplyVisible(r, viewerId, post))
}
