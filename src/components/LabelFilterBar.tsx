/**
 * 担当: B（タイムラインの表示と、ラベルによる絞り込み）
 *
 * 表示中のラベルを切り替えるボタン列（企画書 §5）。
 * ここで選ばれたラベルを timelineFilter.ts に渡して絞り込む。
 */
import type { Label } from "../types"

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

  return (
    <section className="label-filter-bar" aria-label="表示中のラベル">
      <h2 className="label-filter-bar__heading">表示中のラベル</h2>
      <div className="label-filter-bar__buttons">
        {labels.map((label) => {
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
