/**
 * 担当: D（全体の枠組み）
 *
 * 大学からのお知らせ。ラベルによる絞り込みを一切通さず、
 * 常に画面の最上部に全員へ同じ内容を表示する（企画書 §6）。
 */
import type { Announcement } from "../types"
import { formatDate } from "../lib/format"

export function AnnouncementBanner({
  announcements,
}: {
  announcements: Announcement[]
}) {
  if (announcements.length === 0) return null

  return (
    <section className="announcement-banner" aria-label="大学からのお知らせ">
      <h2 className="announcement-banner__heading">📌 大学からのお知らせ</h2>
      <ul className="announcement-banner__list">
        {announcements.map((a) => (
          <li key={a.id} className="announcement-banner__item">
            <span className="announcement-banner__title">{a.title}</span>
            <span className="announcement-banner__date">
              {formatDate(a.publishedAt)}
            </span>
            <p className="announcement-banner__body">{a.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
