/**
 * 担当: B（タイムラインの表示と、ラベルによる絞り込み）
 *
 * 表示中のラベルを切り替えるボタン列（企画書 §5）。
 * ここで選ばれたラベルを timelineFilter.ts に渡して絞り込む。
 *
 * ラベルは types.ts の LabelCategory（学部学年／履修科目／課外活動／関心／キャンパス）
 * ごとに見出しを付けてグループ化する。あくまで「見た目の整理」であって、
 * 絞り込みの扱いはどのカテゴリのラベルでも同じ（企画書 §4「科目を特別扱いしない」）。
 *
 * 「学部学年」だけは例外的にプルダウン2つ（学部／学年）で選ぶUIにする。
 * データ上のラベルは「情報学部3年」のように学部と学年が合体した1つのラベルの
 * ままなので（types.ts / labels.ts は変更しない）、プルダウンの選択結果を
 * 「学部学年カテゴリの中で、条件に合うラベルIDだけをONにする」処理に変換して、
 * 既存の onToggle 経由でラベルの選択状態を更新する。
 */
import type { Label, LabelCategory } from "../types"

/** チップ表示するカテゴリの表示順（学部学年はプルダウン扱いなのでここには含めない） */
const CHIP_CATEGORY_ORDER: Exclude<LabelCategory, "学部学年">[] = [
  "履修科目",
  "課外活動",
  "関心",
  "キャンパス",
]

/** CSSのクラス名に使うための英語スラッグ（日本語のままだと扱いにくいため） */
const CATEGORY_SLUG: Record<LabelCategory, string> = {
  学部学年: "faculty-grade",
  履修科目: "subject",
  課外活動: "club",
  関心: "interest",
  キャンパス: "campus",
}

/** 未選択を表す値。学部・学年どちらのプルダウンでも「指定なし」に使う */
const UNSPECIFIED = ""

/** 「情報学部3年」→ { faculty: "情報学部", grade: "3年" } のように分解する */
function parseFacultyGrade(name: string): { faculty: string; grade: string } | null {
  const m = name.match(/^(.+学部)(\d+)年$/)
  if (!m) return null
  return { faculty: m[1], grade: `${m[2]}年` }
}

function groupByCategory(
  labels: Label[],
): [Exclude<LabelCategory, "学部学年">, Label[]][] {
  const groups = new Map<string, Label[]>()
  for (const label of labels) {
    if (label.category === "学部学年") continue
    const list = groups.get(label.category)
    if (list) {
      list.push(label)
    } else {
      groups.set(label.category, [label])
    }
  }
  return CHIP_CATEGORY_ORDER.filter((category) => groups.has(category)).map(
    (category) => [category, groups.get(category)!],
  )
}

export function LabelFilterBar({
  labels,
  selectedLabelIds,
  onToggle,
  onClearAll,
}: {
  labels: Label[]
  selectedLabelIds: string[]
  onToggle: (labelId: string) => void
  onClearAll: () => void
}) {
  const selected = new Set(selectedLabelIds)
  const grouped = groupByCategory(labels)

  // --- 学部学年：ラベルを学部・学年に分解し、プルダウンの選択肢を作る ---
  const facultyGradeLabels = labels
    .filter((l): l is Label => l.category === "学部学年")
    .map((label) => ({ label, parsed: parseFacultyGrade(label.name) }))
    .filter(
      (entry): entry is { label: Label; parsed: { faculty: string; grade: string } } =>
        entry.parsed !== null,
    )

  const facultyOptions: string[] = []
  const gradeOptions: string[] = []
  for (const { parsed } of facultyGradeLabels) {
    if (!facultyOptions.includes(parsed.faculty)) facultyOptions.push(parsed.faculty)
    if (!gradeOptions.includes(parsed.grade)) gradeOptions.push(parsed.grade)
  }
  gradeOptions.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

  // 現在選択中の「学部学年」ラベルから、プルダウンの表示値を逆算する
  // （学部だけ・学年だけ選んでいる状態を保つため、複数選ばれていても
  //   全部が同じ学部／学年ならその値を、バラバラなら「指定なし」を表示する）
  const selectedFacultyGrade = facultyGradeLabels.filter(({ label }) =>
    selected.has(label.id),
  )
  const currentFaculty = uniqueValueOrUnspecified(
    selectedFacultyGrade.map(({ parsed }) => parsed.faculty),
  )
  const currentGrade = uniqueValueOrUnspecified(
    selectedFacultyGrade.map(({ parsed }) => parsed.grade),
  )

  function applyFacultyGrade(nextFaculty: string, nextGrade: string) {
    const matchIds = facultyGradeLabels
      .filter(
        ({ parsed }) =>
          (nextFaculty === UNSPECIFIED || parsed.faculty === nextFaculty) &&
          (nextGrade === UNSPECIFIED || parsed.grade === nextGrade),
      )
      .map(({ label }) => label.id)

    const currentIds = selectedFacultyGrade.map(({ label }) => label.id)
    // 今の学部学年カテゴリの選択と、新しい条件に合うIDの差分だけ toggle する
    for (const id of currentIds) {
      if (!matchIds.includes(id)) onToggle(id)
    }
    for (const id of matchIds) {
      if (!currentIds.includes(id)) onToggle(id)
    }
  }

  return (
    <section className="label-filter-bar" aria-label="表示中のラベル">
      <div className="label-filter-bar__top">
        <h2 className="label-filter-bar__heading">表示中のラベル</h2>
        <button
          type="button"
          className="label-filter-bar__clear"
          onClick={onClearAll}
          disabled={selectedLabelIds.length === 0}
        >
          すべて表示 →
        </button>
      </div>

      <div className="label-filter-bar__group label-filter-bar__group--faculty-grade">
        <span className="label-filter-bar__group-name">学部学年</span>
        <div className="label-filter-bar__dropdowns">
          <select
            aria-label="学部で絞り込む"
            value={currentFaculty}
            onChange={(e) => applyFacultyGrade(e.target.value, currentGrade)}
          >
            <option value={UNSPECIFIED}>学部：指定なし</option>
            {facultyOptions.map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
          <select
            aria-label="学年で絞り込む"
            value={currentGrade}
            onChange={(e) => applyFacultyGrade(currentFaculty, e.target.value)}
          >
            <option value={UNSPECIFIED}>学年：指定なし</option>
            {gradeOptions.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      {grouped.map(([category, categoryLabels]) => (
        <div
          key={category}
          className={`label-filter-bar__group label-filter-bar__group--${CATEGORY_SLUG[category]}`}
        >
          <span className="label-filter-bar__group-name">{category}</span>
          <div className="label-filter-bar__buttons">
            {categoryLabels.map((label) => {
              const isOn = selected.has(label.id)
              const slug = CATEGORY_SLUG[label.category]
              return (
                <button
                  key={label.id}
                  type="button"
                  className={
                    isOn
                      ? `label-chip label-chip--on label-chip--${slug}`
                      : `label-chip label-chip--off label-chip--${slug}`
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
      ))}
    </section>
  )
}

/** 配列の中身が全部同じ値ならその値を、空 or バラバラなら UNSPECIFIED を返す */
function uniqueValueOrUnspecified(values: string[]): string {
  if (values.length === 0) return UNSPECIFIED
  const first = values[0]
  return values.every((v) => v === first) ? first : UNSPECIFIED
}
