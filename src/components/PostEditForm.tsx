/**
 * 「投稿を編集」から、自分の投稿1件を開いたときに出てくる編集フォーム。
 * PostForm（新規投稿）とほぼ同じ入力項目に加えて、状態（募集中／やり取り中／完了）の
 * 変更と、削除ボタンを持つ。
 */
import { useState } from "react"
import type { Label, Post, PostDirection, PostKind, PostStatus } from "../types"

const DIRECTIONS: PostDirection[] = ["提供します", "求めています"]
const KINDS: PostKind[] = ["モノ", "手伝い"]
const STATUS_OPTIONS: PostStatus[] = ["募集中", "やり取り中", "完了"]

export function PostEditForm({
  post,
  labels,
  onSave,
  onDelete,
  onCancel,
}: {
  post: Post
  labels: Label[]
  onSave: (patch: Partial<Post>) => void
  onDelete: () => void
  onCancel: () => void
}) {
  const [direction, setDirection] = useState<PostDirection>(post.direction)
  const [kind, setKind] = useState<PostKind>(post.kind)
  const [title, setTitle] = useState(post.title)
  const [body, setBody] = useState(post.body)
  const [price, setPrice] = useState(
    post.price !== undefined ? String(post.price) : "",
  )
  const [place, setPlace] = useState(post.place)
  const [status, setStatus] = useState<PostStatus>(post.status)
  const [tagLabelIds, setTagLabelIds] = useState<string[]>(post.tagLabelIds)
  const [showErrors, setShowErrors] = useState(false)

  const priceError =
    kind === "モノ" && price !== "" && Number(price) < 0
      ? "0円以上を入力してください"
      : null

  const isValid = title.trim() !== "" && place.trim() !== "" && priceError === null

  function toggleTag(labelId: string) {
    setTagLabelIds((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) {
      setShowErrors(true)
      return
    }

    onSave({
      direction,
      kind,
      title: title.trim(),
      body: body.trim(),
      price: kind === "モノ" && price ? Number(price) : undefined,
      place: place.trim(),
      status,
      tagLabelIds,
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <form className="post-form post-manager__form" onSubmit={handleSubmit} noValidate>
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
        受け渡し・やり取りの場所
        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="荒牧 / オンライン可 など"
          aria-invalid={showErrors && !place.trim()}
        />
        {showErrors && !place.trim() && (
          <span className="post-form__error">受け渡し・やり取りの場所を入力してください</span>
        )}
      </label>

      <label className="post-form__field">
        状態
        <select value={status} onChange={(e) => setStatus(e.target.value as PostStatus)}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="post-form__tags">
        <legend>タグ</legend>
        <div className="post-form__tag-list">
          {labels.map((label) => {
            const isOn = tagLabelIds.includes(label.id)
            return (
              <button
                key={label.id}
                type="button"
                className={
                  isOn ? "label-chip label-chip--on" : "label-chip label-chip--off"
                }
                aria-pressed={isOn}
                onClick={() => toggleTag(label.id)}
              >
                {label.name}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="post-form__actions post-manager__form-actions">
        <button type="button" className="post-manager__delete" onClick={onDelete}>
          この投稿を削除する
        </button>
        <button type="button" onClick={onCancel}>
          やめる
        </button>
        <button type="submit">保存する</button>
      </div>
    </form>
  )
}
