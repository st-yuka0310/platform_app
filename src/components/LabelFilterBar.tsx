/**
 * 担当: B（タイムラインの表示と、ラベルによる絞り込み）
 *
 * 「今、絞り込み条件として選ばれているラベル」だけを並べる（企画書 §5）。
 * ここで選ばれたラベルを timelineFilter.ts に渡して絞り込む。
 * 選ばれていないラベルは並べない。新しく条件を足すのは🔍ラベルを探す側の
 * 役目（表示中のラベル欄は「今の状態を見て、外す」ための場所）。チップを
 * 押すと選択を外せる。
 *
 * ただし「履修中の講義」「所属サークル」の2つのまとめボタンは例外で、
 * オフのときも常に表示する。これはプロフィール登録で自分が選んだ「自分が
 * 誰か」を表す情報なので、絞り込みをオフにしていても、いつでもワンクリックで
 * 自分の既定条件に戻せるようにするため。履修科目・課外活動は、大学全体の
 * 講義・サークル数が多く1つずつボタンにするのは非現実的なので、この2つに
 * まとめている（企画書 §4 の絞り込みの延長）。
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
  onToggleAll,
  enrolledCourseLabelIds,
  onToggleEnrolledCourses,
  myClubLabelIds,
  onToggleMyClubs,
}: {
  labels: Label[]
  selectedLabelIds: string[]
  onToggle: (labelId: string) => void
  /** 渡したidの集合を、全部選択済みなら全解除、そうでなければ全選択する */
  onToggleAll: (ids: string[]) => void
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

  // このバーには「今選ばれているもの」だけを出す。選ばれていない学部・学年・
  // 関心・キャンパスまで常に並べると、候補が増えるほど埋もれて見づらくなる上、
  // 🔍ラベルを探すと同じチップが二重に出ることになる。
  const activeOtherLabels = otherLabels.filter((l) => selected.has(l.id))

  // 🔍ラベルを探す（CourseFinder・LabelSearchの履修科目/課外活動チップ）で、
  // 「履修中の講義」「所属サークル」に含まれない科目・サークルを絞り込み条件として
  // 選んだ場合、ここに出さないと「表示中のラベル」欄のどこにも出てこず、閉じたあと
  // 何が効いているのか分からなくなる（README §9 参照）。個別チップとして表示する。
  const extraLabels = labels.filter(
    (l) =>
      (l.category === "履修科目" || l.category === "課外活動") &&
      selected.has(l.id) &&
      !enrolledCourseLabelIds.includes(l.id) &&
      !myClubLabelIds.includes(l.id),
  )

  // バーに出す「選択中」チップ（学部・学年・関心・キャンパス＋上のextraLabels）。
  // どちらも見た目・挙動は同じ（押すと外れる）ので1つにまとめて描画する。
  const activeChips = [...activeOtherLabels, ...extraLabels]

  // 「すべて表示」ボタンで全部ON/全部OFFを切り替える対象。
  // ここに並んでいるチップ（学部・学年・関心・キャンパスの個別ボタン＋
  // 履修中の講義／所属サークルのまとめボタンの中身＋上のextraLabels）が対象で、
  // 検索（🔍 ラベルを探す）でしか出てこない履修科目・課外活動の全件は含めない。
  const allVisibleIds = [
    ...otherLabels.map((l) => l.id),
    ...enrolledCourseLabelIds,
    ...myClubLabelIds,
    ...extraLabels.map((l) => l.id),
  ]
  const allSelected =
    allVisibleIds.length > 0 && allVisibleIds.every((id) => selected.has(id))

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

        {activeChips.map((label) => (
          <button
            key={label.id}
            type="button"
            className="label-chip label-chip--on"
            aria-pressed={true}
            onClick={() => onToggle(label.id)}
          >
            {label.name} ✓
          </button>
        ))}
        <button
          type="button"
          className="label-filter-bar__clear"
          onClick={() => onToggleAll(allVisibleIds)}
        >
          {allSelected ? "すべて解除 →" : "すべて選択 →"}
        </button>
      </div>
    </section>
  )
}
