/**
 * 投稿にタグとして履修科目を付けるための選択欄。CourseFinder（検索タブ）と
 * 同じ「学部・学年で先に絞り込む」方式（lib/useCourseDrilldown.ts）だが、
 * ここでは選ぶだけでよく、シラバスを見るⓘボタンや共有パネルは持たない。
 */
import { useState } from "react"
import type { Label } from "../types"
import { useCourseDrilldown } from "../lib/useCourseDrilldown"

export function CourseTagPicker({
  labels,
  selectedLabelIds,
  onToggle,
}: {
  labels: Label[]
  selectedLabelIds: string[]
  onToggle: (labelId: string) => void
}) {
  const [query, setQuery] = useState("")
  const {
    facultyFilter,
    setFacultyFilter,
    gradeFilter,
    setGradeFilter,
    faculties,
    grades,
    hasAnyFilter,
    narrowedLabels,
  } = useCourseDrilldown(labels, query.trim())
  const selected = new Set(selectedLabelIds)

  return (
    <div className="course-tag-picker">
      <div className="course-finder__filters">
        <select
          value={facultyFilter}
          onChange={(e) => setFacultyFilter(e.target.value)}
          aria-label="学部で絞り込む"
        >
          <option value="">学部：すべて</option>
          {faculties.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          aria-label="学年で絞り込む"
        >
          <option value="">学年：すべて</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="科目名で探す"
          className="course-tag-picker__input"
        />
      </div>

      {!hasAnyFilter ? (
        <p className="course-finder__empty">
          学部・学年を選ぶか、科目名を入力してください。
        </p>
      ) : narrowedLabels.length === 0 ? (
        <p className="course-finder__empty">該当する科目がありません。</p>
      ) : (
        <div className="post-form__tag-list">
          {narrowedLabels.map((label) => {
            const isOn = selected.has(label.id)
            return (
              <button
                key={label.id}
                type="button"
                className={
                  isOn ? "label-chip label-chip--on" : "label-chip label-chip--off"
                }
                aria-pressed={isOn}
                onClick={() => onToggle(label.id)}
              >
                {label.name} {isOn ? "✓" : ""}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
