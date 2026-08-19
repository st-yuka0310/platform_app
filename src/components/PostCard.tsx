/**
 * 担当: D（共通部品）／B・C が中身を拡張してよい
 *
 * 投稿1件分の表示。企画書 §5 のタイムライン1件ぶんにあたる。
 */
import type { Post, PostStatus, Reply } from "../types"
import { labelName, userName, formatDate } from "../lib/format"
import { useViewer } from "../context/ViewerContext"
import { ReplyThread } from "./ReplyThread"

const STATUS_OPTIONS: PostStatus[] = ["募集中", "やり取り中", "完了"]

export function PostCard({
  post,
  replies,
  onAddReply,
  onChangeStatus,
}: {
  post: Post
  replies: Reply[]
  onAddReply: (reply: Reply) => void
  onChangeStatus: (postId: string, status: PostStatus) => void
}) {
  const { viewerId } = useViewer()
  const isAuthor = viewerId === post.authorId

  return (
    <article
      className={
        post.status === "完了"
          ? "post-card post-card--done"
          : "post-card"
      }
    >
      <header className="post-card__header">
        <span className="post-card__direction">
          {post.direction}・{post.kind}
        </span>
        <span className="post-card__status">{post.status}</span>
      </header>

      <h3 className="post-card__title">
        {post.title}
        {post.kind === "モノ" && post.price !== undefined && (
          <span className="post-card__price"> {post.price}円</span>
        )}
      </h3>

      <p className="post-card__body">{post.body}</p>

      <p className="post-card__meta">
        {post.place}／{userName(post.authorId)}／{formatDate(post.createdAt)}
      </p>

      <ul className="post-card__tags">
        {post.tagLabelIds.map((labelId) => (
          <li key={labelId} className="post-card__tag">
            {labelName(labelId)}
          </li>
        ))}
      </ul>

      {isAuthor && (
        <label className="post-card__status-control">
          状態を変える：
          <select
            value={post.status}
            onChange={(e) =>
              onChangeStatus(post.id, e.target.value as PostStatus)
            }
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      )}

      <ReplyThread post={post} replies={replies} onAddReply={onAddReply} />
    </article>
  )
}
