/**
 * 担当: A（投稿の作成画面。2軸の選択とタグ付け）
 *
 * 投稿は1種類だけで、違いは2軸（提供します/求めています ×
 * モノ/手伝い/情報）とタグだけ（企画書 §3）。別ページには移らず、
 * 画面の中に入力欄が開く（企画書 §5）。
 */
import { useState } from "react"
import type { Label, Post, PostDirection, PostKind } from "../types"
import { useViewer } from "../context/ViewerContext"

const DIRECTIONS: PostDirection[] = ["提供します", "求めています"]
const KINDS: PostKind[] = ["モノ", "手伝い", "情報"]

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
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !place.trim()) return

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
      createdAt: new Date().toISOString(),
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
    <form className="post-form" onSubmit={handleSubmit}>
      <fieldset className="post-form__axis">
        <legend>どちらですか</legend>
        {DIRECTIONS.map((d) => (
          <label key={d}>
            <input
              type="radio"
              name="direction"
              checked={direction === d}
              onChange={() => setDirection(d)}
            />
            {d}
          </label>
        ))}
      </fieldset>

      <fieldset className="post-form__axis">
        <legend>何についてですか</legend>
        {KINDS.map((k) => (
          <label key={k}>
            <input
              type="radio"
              name="kind"
              checked={kind === k}
              onChange={() => setKind(k)}
            />
            {k}
          </label>
        ))}
      </fieldset>

      <label className="post-form__field">
        タイトル
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>

      <label className="post-form__field">
        くわしく
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
      </label>

      {kind === "モノ" && (
        <label className="post-form__field">
          金額（円）
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
      )}

      <label className="post-form__field">
        受け渡し・やり取りの場所
        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="荒牧 / オンライン可 など"
          required
        />
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

      <div className="post-form__actions">
        <button type="button" onClick={() => setOpen(false)}>
          やめる
        </button>
        <button type="submit">投稿する</button>
      </div>
    </form>
  )
}
