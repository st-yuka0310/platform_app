/**
 * 「自分の投稿に返信が来たら」だけの、最小限の通知ベル。
 * ヘッダーに常時表示し、未読があれば件数バッジを出す。開くと一覧が見え、
 * 開いた時点までを既読にする（lib/notifications.ts）。
 */
import { useState } from "react"
import type { Post, Reply } from "../types"
import { useViewer } from "../context/ViewerContext"
import {
  collectNotifications,
  isUnseen,
  markAllSeen,
} from "../lib/notifications"
import { displayAuthorName, formatDateTime } from "../lib/format"

export function NotificationBell({
  posts,
  replies,
  onSelectPost,
}: {
  posts: Post[]
  replies: Reply[]
  /** 通知の投稿を選んだときに、その投稿のidを渡す（Timelineへジャンプする） */
  onSelectPost: (postId: string) => void
}) {
  const { viewerId } = useViewer()
  const [open, setOpen] = useState(false)

  const notifications = collectNotifications(posts, replies, viewerId)
  const unreadCount = notifications.filter((n) => isUnseen(viewerId, n.reply))
    .length

  function handleToggle() {
    setOpen((v) => {
      const next = !v
      if (next) markAllSeen(viewerId)
      return next
    })
  }

  return (
    <div className="notification-bell">
      <button
        type="button"
        className="notification-bell__button"
        onClick={handleToggle}
        aria-label={`通知${unreadCount > 0 ? `（未読${unreadCount}件）` : ""}`}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-bell__badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notification-bell__panel">
          <p className="notification-bell__title">自分の投稿への返信</p>
          {notifications.length === 0 ? (
            <p className="notification-bell__empty">まだ返信はありません。</p>
          ) : (
            <ul className="notification-bell__list">
              {notifications.map((n) => (
                <li key={n.reply.id}>
                  <button
                    type="button"
                    className="notification-bell__item"
                    onClick={() => {
                      onSelectPost(n.post.id)
                      setOpen(false)
                    }}
                  >
                    <span className="notification-bell__author">
                      {displayAuthorName(n.reply.authorId, n.reply.isAnonymous, viewerId)}
                    </span>
                    さんが「{n.post.title}」に返信
                    <p className="notification-bell__body">{n.reply.body}</p>
                    <span className="notification-bell__date">
                      {formatDateTime(n.reply.createdAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
