/**
 * 「求めています」投稿のうち講義タグ付きのものをどう見せるかを選ぶラジオボタン群。
 * lib/courseRequestFilter.ts の3モードにそのまま対応する。
 */
import type { CourseRequestMode } from "../lib/courseRequestFilter"

const OPTIONS: { value: CourseRequestMode; label: string }[] = [
  { value: "mine", label: "履修中・履修済みの講義の投稿だけ" },
  { value: "all", label: "すべての投稿" },
  { value: "hidden", label: "非表示" },
]

export function CourseRequestFilter({
  mode,
  onChange,
}: {
  mode: CourseRequestMode
  onChange: (mode: CourseRequestMode) => void
}) {
  return (
    <fieldset
      className="course-request-filter"
      aria-label="「求めています」の投稿の表示"
    >
      <legend className="label-filter-bar__heading">
        「求めています」の投稿
      </legend>
      <div className="course-request-filter__options">
        {OPTIONS.map((opt) => (
          <label key={opt.value} className="course-request-filter__option">
            <input
              type="radio"
              name="course-request-mode"
              value={opt.value}
              checked={mode === opt.value}
              onChange={() => onChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
