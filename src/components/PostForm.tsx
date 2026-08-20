/**
 * 担当: A（投稿の作成画面。2軸の選択とタグ付け）
 *
 * 投稿は1種類だけで、違いは2軸（提供します/求めています ×
 * モノ/手伝い/情報）とタグだけ（企画書 §3）。別ページには移らず、
 * 画面の中に入力欄が開く（企画書 §5）。
 *
 * タグ選択は、履修科目だけ他のカテゴリと分けている。履修科目は
 * 数百件になりうるため、学部・学年で先に絞り込む CourseTagPicker を使う
 * （検索タブの CourseFinder と同じ絞り込みロジックを共有、lib/useCourseDrilldown.ts）。
 */
import { useState } from "react"
import type { Label, Post, PostDirection, PostKind } from "../types"
import { useViewer } from "../context/ViewerContext"
import { LABEL_CATEGORIES, labelsInCategory } from "../lib/labels"
import { CourseTagPicker } from "./CourseTagPicker"

const DIRECTIONS: PostDirection[] = ["提供します", "求めています"]
const KINDS: PostKind[] = ["モノ", "手伝い", "情報"]
const FLAT_TAG_CATEGORIES = LABEL_CATEGORIES.filter((c) => c !== "履修科目")

export function PostForm({
  labels,
  onAddPost,
}: {
  labels: Label[]
  onAddPost: (post: Post) => void
}) {
  const { viewerId } = useViewer()
  const [open, setOpen] = useState(false)

  const [direction, setDirection] = useState<PostDirection>("提供します")
  const [kind, setKind] = useState<PostKind>("モノ")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [price, setPrice] = useState("")
  const [place, setPlace] = useState("")
  const [tagLabelIds, setTagLabelIds] = useState<string[]>([])
  const [showErrors, setShowErrors] = useState(false)

  // 金額欄は「モノ」のときだけ意味を持つので、それ以外では検証しない
  const priceError =
    kind === "モノ" && price !== "" && Number(price) < 0
      ? "0円以上を入力してください"
      : null

  // 場所は「モノ」「手伝い」では受け渡し・待ち合わせのために必須だが、
  // 「情報」はオンラインでも成立するやり取りなので必須にしない
  const placeRequired = kind !== "情報"

  const isValid =
    title.trim() !== "" &&
    (!placeRequired || place.trim() !== "") &&
    priceError === null

  function toggleTag(labelId: string) {
    setTagLabelIds((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    )
  }

  function resetForm() {
    setDirection("提供します")
    setKind("モノ")
    setTitle("")
    setBody("")
    setPrice("")
    setPlace("")
    setTagLabelIds([])
    setShowErrors(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) {
      setShowErrors(true)
      return
    }

    const now = new Date().toISOString()
    onAddPost({
      id: `p-${crypto.randomUUID()}`,
      authorId: viewerId,
      direction,
      kind,
      title: title.trim(),
      body: body.trim(),
      price: kind === "モノ" && price ? Number(price) : undefined,
      place: place.trim(),
      status: "募集中",
      tagLabelIds,
      createdAt: now,
      updatedAt: now,
    })

    resetForm()
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        type="button"
        className="post-form__open"
        onClick={() => setOpen(true)}
      >
        ＋ 投稿する
      </button>
    )
  }

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="post-form__axis">
        <legend>どちらですか</legend>
        <div className="post-form__chip-group">
          {DIRECTIONS.map((d) => (
            <button
              key={d}
              type="button"
              className={
                direction === d
                  ? "axis-chip axis-chip--on"
                  : "axis-chip axis-chip--off"
              }
              aria-pressed={direction === d}
              onClick={() => setDirection(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="post-form__axis">
        <legend>何についてですか</legend>
        <div className="post-form__chip-group">
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              className={
                kind === k ? "axis-chip axis-chip--on" : "axis-chip axis-chip--off"
              }
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
            >
              {k}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="post-form__field">
        タイトル
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={showErrors && !title.trim()}
        />
        {showErrors && !title.trim() && (
          <span className="post-form__error">タイトルを入力してください</span>
        )}
      </label>

      <label className="post-form__field">
        くわしく
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
      </label>

      <div
        className={
          kind === "モノ"
            ? "post-form__price post-form__price--open"
            : "post-form__price"
        }
      >
        <label className="post-form__field">
          金額（円）
          <input
            type="number"
            min={0}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            aria-invalid={showErrors && priceError !== null}
          />
          {showErrors && priceError && (
            <span className="post-form__error">{priceError}</span>
          )}
        </label>
      </div>

      <label className="post-form__field">
        受け渡し・やり取りの場所{!placeRequired && "（任意）"}
        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder={
            placeRequired
              ? "荒牧 / オンライン可 など"
              : "対面で話したい場合だけ入力してください"
          }
          aria-invalid={showErrors && placeRequired && !place.trim()}
        />
        {showErrors && placeRequired && !place.trim() && (
          <span className="post-form__error">受け渡し・やり取りの場所を入力してください</span>
        )}
      </label>

      <fieldset className="post-form__tags">
        <legend>タグ</legend>

        <p className="label-filter-bar__heading">履修科目</p>
        <CourseTagPicker
          labels={labels}
          selectedLabelIds={tagLabelIds}
          onToggle={toggleTag}
        />

        {FLAT_TAG_CATEGORIES.map((category) => {
          const categoryLabels = labelsInCategory(labels, category)
          if (categoryLabels.length === 0) return null
          return (
            <div key={category} className="label-search__category">
              <p className="label-filter-bar__heading">{category}</p>
              <div className="post-form__tag-list">
                {categoryLabels.map((label) => {
                  const isOn = tagLabelIds.includes(label.id)
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
                      onClick={() => toggleTag(label.id)}
                    >
                      {label.name} {isOn ? "✓" : ""}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </fieldset>

      <div className="post-form__actions">
        <button type="button" onClick={() => setOpen(false)}>
          やめる
        </button>
        <button type="submit">投稿する</button>
      </div>
    </form>
  )
}
