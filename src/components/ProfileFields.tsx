/**
 * 「キャンパス・学部・学年・履修科目・課外活動・関心」を選ぶ入力群。
 * 新規登録（LoginForm）とプロフィール編集（ProfileEditor）の両方で使う。
 *
 * 履修科目だけは「履修中／履修済み」の状態を持つので、他のラベル
 * （チップのオン・オフだけ）とは別の見せ方（状態を3つ巡回するボタン）にしている。
 * 履修科目は数百件になりうるため、学部・学年で先に絞り込む
 * lib/useCourseDrilldown.ts（CourseFinder・CourseTagPickerと共通）を使う。
 */
import { useState } from "react"
import type { Campus, CourseStatus, LabelCategory, UserCourse } from "../types"
import { sampleLabels } from "../data/labels"
import { labelsInCategory } from "../lib/labels"
import { useCourseDrilldown } from "../lib/useCourseDrilldown"

const CAMPUSES: Campus[] = ["荒牧", "桐生", "昭和"]

// プルダウン（単一選択）で選ぶカテゴリ
const DROPDOWN_CATEGORIES: LabelCategory[] = ["学部", "学年"]

// チップ（複数選択・状態なし）で選ぶカテゴリ。
// キャンパスは専用フィールドがあるのでここには含めない。履修科目は別枠。
const MULTI_SELECT_CATEGORIES: LabelCategory[] = ["課外活動", "関心"]

function selectedIdIn(labelIds: string[], category: LabelCategory): string {
  const ids = new Set(labelsInCategory(sampleLabels, category).map((l) => l.id))
  return labelIds.find((id) => ids.has(id)) ?? ""
}

/** ボタンを押すたびに 未選択 → 履修中 → 履修済み → 未選択 と巡回する */
function nextCourseStatus(current: CourseStatus | null): CourseStatus | null {
  if (current === null) return "履修中"
  if (current === "履修中") return "履修済み"
  return null
}

export interface ProfileFieldsValue {
  campus: Campus
  labelIds: string[]
  courses: UserCourse[]
}

export function ProfileFields({
  value,
  onChange,
}: {
  value: ProfileFieldsValue
  onChange: (next: ProfileFieldsValue) => void
}) {
  const { campus, labelIds, courses } = value
  const [courseQuery, setCourseQuery] = useState("")
  const {
    facultyFilter,
    setFacultyFilter,
    gradeFilter,
    setGradeFilter,
    faculties,
    grades,
    hasAnyFilter,
    narrowedLabels,
  } = useCourseDrilldown(sampleLabels, courseQuery.trim())

  function setCampus(c: Campus) {
    onChange({ campus: c, labelIds, courses })
  }

  function setDropdownValue(category: LabelCategory, labelId: string) {
    const ids = new Set(labelsInCategory(sampleLabels, category).map((l) => l.id))
    const withoutCategory = labelIds.filter((id) => !ids.has(id))
    onChange({
      campus,
      labelIds: labelId ? [...withoutCategory, labelId] : withoutCategory,
      courses,
    })
  }

  function toggleChip(labelId: string) {
    const next = labelIds.includes(labelId)
      ? labelIds.filter((id) => id !== labelId)
      : [...labelIds, labelId]
    onChange({ campus, labelIds: next, courses })
  }

  function courseStatusOf(labelId: string): CourseStatus | null {
    return courses.find((c) => c.labelId === labelId)?.status ?? null
  }

  function cycleCourse(labelId: string) {
    const current = courseStatusOf(labelId)
    const next = nextCourseStatus(current)
    const withoutThis = courses.filter((c) => c.labelId !== labelId)
    onChange({
      campus,
      labelIds,
      courses: next ? [...withoutThis, { labelId, status: next }] : withoutThis,
    })
  }

  return (
    <>
      <fieldset className="post-form__axis">
        <legend>キャンパス</legend>
        {CAMPUSES.map((c) => (
          <label key={c}>
            <input
              type="radio"
              name="campus"
              checked={campus === c}
              onChange={() => setCampus(c)}
            />
            {c}
          </label>
        ))}
      </fieldset>

      {DROPDOWN_CATEGORIES.map((category) => (
        <label key={category} className="post-form__field">
          {category}
          <select
            value={selectedIdIn(labelIds, category)}
            onChange={(e) => setDropdownValue(category, e.target.value)}
            required
          >
            <option value="">選択してください</option>
            {labelsInCategory(sampleLabels, category).map((label) => (
              <option key={label.id} value={label.id}>
                {label.name}
              </option>
            ))}
          </select>
        </label>
      ))}

      <fieldset className="post-form__tags">
        <legend>
          履修科目（ボタンを押すたびに 未選択 → 履修中 → 履修済み と切り替わります）
        </legend>

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
            value={courseQuery}
            onChange={(e) => setCourseQuery(e.target.value)}
            placeholder="科目名で探す"
            className="course-tag-picker__input"
          />
        </div>

        {!hasAnyFilter ? (
          <p className="course-finder__empty">
            学部・学年を選ぶか、科目名を入力してください。すでに履修中／履修済みにした科目は、絞り込まなくても下に残ります。
          </p>
        ) : (
          <div className="post-form__tag-list">
            {narrowedLabels.length === 0 && (
              <p className="course-finder__empty">該当する科目がありません。</p>
            )}
            {narrowedLabels.map((label) => {
              const status = courseStatusOf(label.id)
              const className =
                status === "履修中"
                  ? "label-chip label-chip--on"
                  : status === "履修済み"
                    ? "label-chip label-chip--done"
                    : "label-chip label-chip--off"
              return (
                <button
                  key={label.id}
                  type="button"
                  className={className}
                  onClick={() => cycleCourse(label.id)}
                >
                  {label.name}
                  {status ? `（${status}）` : ""}
                </button>
              )
            })}
          </div>
        )}

        {/* 絞り込みで隠れていても、すでに履修中／履修済みにした科目は見失わないようここに残す */}
        {courses.length > 0 && (
          <>
            <p className="label-filter-bar__heading">選択中の履修科目</p>
            <div className="post-form__tag-list">
              {courses.map((c) => {
                const label = sampleLabels.find((l) => l.id === c.labelId)
                if (!label) return null
                const className =
                  c.status === "履修中"
                    ? "label-chip label-chip--on"
                    : "label-chip label-chip--done"
                return (
                  <button
                    key={c.labelId}
                    type="button"
                    className={className}
                    onClick={() => cycleCourse(c.labelId)}
                  >
                    {label.name}（{c.status}）
                  </button>
                )
              })}
            </div>
          </>
        )}
      </fieldset>

      <fieldset className="post-form__tags">
        <legend>そのほか関係のあるラベル</legend>
        {MULTI_SELECT_CATEGORIES.map((category) => (
          <div key={category}>
            <p className="label-filter-bar__heading">{category}</p>
            <div className="post-form__tag-list">
              {labelsInCategory(sampleLabels, category).map((label) => {
                const isOn = labelIds.includes(label.id)
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
                    onClick={() => toggleChip(label.id)}
                  >
                    {label.name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </fieldset>
    </>
  )
}

/** 登録・保存前のバリデーション。学部・学年が未選択なら理由を返す */
export function validateProfileFields(value: ProfileFieldsValue): string | null {
  for (const category of DROPDOWN_CATEGORIES) {
    if (!selectedIdIn(value.labelIds, category)) {
      return `${category}を選んでください`
    }
  }
  return null
}
