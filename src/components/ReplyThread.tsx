/**
 * 担当: C（返信の公開/非公開、視点切り替えとの連動）
 *
 * 投稿への返信を表示・投稿する部分（企画書 §7）。
 * 「誰として見ているか」によって、非公開の返信の見え方が変わる。
 *
 * 匿名（isAnonymous）は、公開/非公開（isPrivate）とは別軸。公開の返信でも
 * 匿名にできるし、非公開の返信でも実名で書ける。匿名にしても authorId自体は
 * 変わらないので、非公開の返信の可視性判定（visibleRepliesFor）には影響しない。
 */
import { useState } from "react"
import type { Post, Reply } from "../types"
import { visibleRepliesFor } from "../lib/replyVisibility"
import { displayAuthorName, formatDateTime } from "../lib/format"
import { useViewer } from "../context/ViewerContext"

export function ReplyThread({
  post,
  replies,
  onAddReply,
}: {
  post: Post
  replies: Reply[]
  onAddReply: (reply: Reply) => void
}) {
  const { viewerId } = useViewer()
  const [open, setOpen] = useState(false)
  const [body, setBody] = useState("")
  const [isPrivate, setIsPrivate] = useState(true)
  const [isAnonymous, setIsAnonymous] = useState(false)

  const visible = visibleRepliesFor(replies, post, viewerId)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    onAddReply({
      id: `r-${crypto.randomUUID()}`,
      postId: post.id,
      authorId: viewerId,
      body: body.trim(),
      isPrivate,
      isAnonymous,
      createdAt: new Date().toISOString(),
    })
    setBody("")
  }

  return (
    <div className="reply-thread">
      <button
        type="button"
        className="reply-thread__toggle"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "やり取りを閉じる" : `やり取りを見る（${visible.length}）`}
      </button>

      {open && (
        <div className="reply-thread__body">
          <ul className="reply-thread__list">
            {visible.length === 0 && (
              <li className="reply-thread__empty">まだ返信はありません</li>
            )}
            {visible.map((r) => (
              <li key={r.id} className="reply-thread__item">
                <span className="reply-thread__author">
                  {displayAuthorName(r.authorId, r.isAnonymous, viewerId)}
                </span>
                <span
                  className={
                    r.isPrivate
                      ? "reply-thread__badge reply-thread__badge--private"
                      : "reply-thread__badge reply-thread__badge--public"
                  }
                >
                  {r.isPrivate ? "非公開" : "公開"}
                </span>
                <span className="reply-thread__date">
                  {formatDateTime(r.createdAt)}
                </span>
                <p className="reply-thread__text">{r.body}</p>
              </li>
            ))}
          </ul>

          <form className="reply-thread__form" onSubmit={handleSubmit}>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="返信を書く"
              rows={2}
            />
            <div className="reply-thread__form-row">
              <label>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                非公開にする（投稿者と自分だけに見せる）
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                匿名で返信する
              </label>
              <button type="submit" disabled={!body.trim()}>
                返信する
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
