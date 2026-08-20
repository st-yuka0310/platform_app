/**
 * ラベルが増えても迷わず探せるようにするための検索欄。
 * Timeline.tsx の「🔍 ラベルを探す」タブの中身として使う（開閉は
 * タブの切り替えが兼ねるので、この中に独自の開閉ボタンは持たない）。
 *
 * 投稿本文・タイトルの全文検索はここには含めない。ラベルの一覧が
 * 増えていくことへの対処であって、投稿内容の検索とは別の話のため。
 */
import { useState } from "react"
import type { Label } from "../types"
import { LABEL_CATEGORIES, labelsInCategory } from "../lib/labels"
import { sampleCourseInfos } from "../data/courseInfos"
import { CourseInfoCard } from "./CourseInfoCard"

export function LabelSearch({
  labels,
  selectedLabelIds,
  onToggle,
}: {
  labels: Label[]
  selectedLabelIds: string[]
  onToggle: (labelId: string) => void
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

      {LABEL_CATEGORIES.map((category) => {
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

            {category === "履修科目" &&
              matches
                .filter((label) => selected.has(label.id))
                .map((label) => {
                  const info = sampleCourseInfos.find(
                    (c) => c.labelId === label.id,
                  )
                  return info ? (
                    <CourseInfoCard key={label.id} info={info} />
                  ) : null
                })}
          </div>
        )
      })}
    </div>
  )
}
