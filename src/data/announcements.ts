import type { Announcement } from "../types"

/**
 * サンプルのお知らせ。ラベルとは繋がっておらず、常に全員の最上部に表示する（企画書 §6）。
 */
export const sampleAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "停電に伴う休講について",
    body: "9/12（土）は荒牧キャンパスで停電作業を行うため、終日休講とします。",
    publishedAt: "2026-08-18T09:00:00+09:00",
  },
  {
    id: "a2",
    title: "後期履修登録システムのメンテナンス",
    body: "8/25（火）9:00〜12:00の間、履修登録システムを利用できません。",
    publishedAt: "2026-08-16T09:00:00+09:00",
  },
]
