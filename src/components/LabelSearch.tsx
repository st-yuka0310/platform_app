/**
 * ラベルが増えても迷わず探せるようにするための検索欄。
 * Timeline.tsx の「🔍 ラベルを探す」タブの中身として使う（開閉は
 * タブの切り替えが兼ねるので、この中に独自の開閉ボタンは持たない）。
 *
 * 投稿本文・タイトルの全文検索はここには含めない。ラベルの一覧が
 * 増えていくことへの対処であって、投稿内容の検索とは別の話のため。
 *
 * 履修科目だけは、他のカテゴリと違って現実には数千件になりうるため
 * CourseFinder に任せる（学部・学年での絞り込み、シラバス共有パネル）。
 */
import { useState } from "react"
import type { Label, Post, PostStatus, Reply } from "../types"
import { LABEL_CATEGORIES, labelsInCategory } from "../lib/labels"
import { CourseFinder } from "./CourseFinder"

const FLAT_CATEGORIES = LABEL_CATEGORIES.filter((c) => c !== "履修科目")

export function LabelSearch({
  labels,
  selectedLabelIds,
  onToggle,
  posts,
  replies,
  onAddReply,
  onChangeStatus,
}: {
  labels: Label[]
  selectedLabelIds: string[]
  onToggle: (labelId: string) => void
  posts: Post[]
  replies: Reply[]
  onAddReply: (reply: Reply) => void
  onChangeStatus: (postId: string, status: PostStatus) => void
}) {
  const [query, setQuery] = useState("")
  const trimmedQuery = query.trim()
  const selected = new Set(selectedLabelIds)

  return (
    <div className="label-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ラベル名で探す（例：統計、テニス）"
        className="label-search__input"
      />

      <CourseFinder
        labels={labels}
        selectedLabelIds={selectedLabelIds}
        onToggle={onToggle}
        query={trimmedQuery}
        posts={posts}
        replies={replies}
        onAddReply={onAddReply}
        onChangeStatus={onChangeStatus}
      />

      {FLAT_CATEGORIES.map((category) => {
        const matches = labelsInCategory(labels, category).filter((label) =>
          label.name.includes(trimmedQuery),
        )
        if (matches.length === 0) return null

        return (
          <div key={category} className="label-search__category">
            <p className="label-filter-bar__heading">{category}</p>
            <div className="post-form__tag-list">
              {matches.map((label) => {
                const isOn = selected.has(label.id)
                return (
                  <button
                    key={label.id}
                    type="button"
                    className={
                      isOn
                        ? "label-chip label-chip--on"
                        : "label-chip label-chip--off"
                    }
                    aria-pressed={isOn}
                    onClick={() => onToggle(label.id)}
                  >
                    {label.name} {isOn ? "✓" : ""}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
