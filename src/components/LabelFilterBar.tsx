/**
 * 担当: B（タイムラインの表示と、ラベルによる絞り込み）
 *
 * 表示中のラベルを切り替えるボタン列（企画書 §5）。
 * ここで選ばれたラベルを timelineFilter.ts に渡して絞り込む。
 *
 * 履修科目・課外活動は、大学全体の講義・サークル数が多く1つずつ選ぶのが
 * 非現実的なので、それぞれ「履修中の講義」「所属サークル」という1つの
 * ボタンにまとめている。押すと、自分に関係するタグをまとめて選択／解除する
 * （企画書 §4 の絞り込みの延長）。学部・学年・関心・キャンパスは、
 * これまで通り1つずつのボタン。
 */
import type { Label } from "../types"

function GroupToggleButton({
  label,
  ids,
  selectedLabelIds,
  onToggle,
}: {
  label: string
  ids: string[]
  selectedLabelIds: string[]
  onToggle: () => void
}) {
  if (ids.length === 0) return null
  const selected = new Set(selectedLabelIds)
  const allSelected = ids.every((id) => selected.has(id))
  return (
    <button
      type="button"
      className={
        allSelected ? "label-chip label-chip--on" : "label-chip label-chip--off"
      }
      aria-pressed={allSelected}
      onClick={onToggle}
    >
      {label} {allSelected ? "✓" : ""}
    </button>
  )
}

export function LabelFilterBar({
  labels,
  selectedLabelIds,
  onToggle,
  onClearAll,
  enrolledCourseLabelIds,
  onToggleEnrolledCourses,
  myClubLabelIds,
  onToggleMyClubs,
}: {
  labels: Label[]
  selectedLabelIds: string[]
  onToggle: (labelId: string) => void
  onClearAll: () => void
  /** 自分が今「履修中」にしている科目のラベルID一覧 */
  enrolledCourseLabelIds: string[]
  /** 「履修中の講義」ボタンを押したときに、そのラベル群をまとめてオン/オフする */
  onToggleEnrolledCourses: () => void
  /** 自分が所属しているサークル（課外活動）のラベルID一覧 */
  myClubLabelIds: string[]
  /** 「所属サークル」ボタンを押したときに、そのラベル群をまとめてオン/オフする */
  onToggleMyClubs: () => void
}) {
  const selected = new Set(selectedLabelIds)

  // 履修科目・課外活動は個別のボタンにはせず、まとめて1つのボタンにする
  const otherLabels = labels.filter(
    (l) => l.category !== "履修科目" && l.category !== "課外活動",
  )

  return (
    <section className="label-filter-bar" aria-label="表示中のラベル">
      <h2 className="label-filter-bar__heading">表示中のラベル</h2>
      <div className="label-filter-bar__buttons">
        <GroupToggleButton
          label="履修中の講義"
          ids={enrolledCourseLabelIds}
          selectedLabelIds={selectedLabelIds}
          onToggle={onToggleEnrolledCourses}
        />
        <GroupToggleButton
          label="所属サークル"
          ids={myClubLabelIds}
          selectedLabelIds={selectedLabelIds}
          onToggle={onToggleMyClubs}
        />

        {otherLabels.map((label) => {
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
        <button
          type="button"
          className="label-filter-bar__clear"
          onClick={onClearAll}
          disabled={selectedLabelIds.length === 0}
        >
          すべて表示 →
        </button>
      </div>
    </section>
  )
}
