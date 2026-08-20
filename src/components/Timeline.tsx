/**
 * 担当: B（タイムラインの表示と、ラベルによる絞り込み）
 *
 * ラベルで絞り込んだ投稿に、Cの担当（範囲外を2割まぜる）を適用してから並べる。
 *
 * 並び順は「新着順」がデフォルト（企画書に明記はないが自然な既定値）。
 * ほかに「募集中を優先」「古い順」を選べる。並び替えは絞り込み・ミックスより
 * 前の段階（sorted を作る時点）で行うので、以降の処理はそのまま使い回せる。
 */
import { useMemo, useState } from "react"
import type { Label, Post, PostStatus, Reply } from "../types"
import { filterPostsByLabels } from "../lib/timelineFilter"
import { mixInOutsideRange } from "../lib/timelineMix"
import { LabelFilterBar } from "./LabelFilterBar"
import { PostCard } from "./PostCard"

type SortOrder = "new" | "old" | "open-first"

const SORT_LABELS: Record<SortOrder, string> = {
  new: "新着順",
  old: "古い順",
  "open-first": "募集中を優先",
}

/** 募集中 → やり取り中 → 完了 の順に並べるための優先度（数字が小さいほど先） */
const STATUS_PRIORITY: Record<PostStatus, number> = {
  募集中: 0,
  やり取り中: 1,
  完了: 2,
}

function sortPosts(posts: Post[], order: SortOrder): Post[] {
  const byDateDesc = (a: Post, b: Post) =>
    b.createdAt.localeCompare(a.createdAt)

  switch (order) {
    case "old":
      return [...posts].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    case "open-first":
      return [...posts].sort((a, b) => {
        const diff = STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]
        return diff !== 0 ? diff : byDateDesc(a, b)
      })
    case "new":
    default:
      return [...posts].sort(byDateDesc)
  }
}

export function Timeline({
  posts,
  replies,
  labels,
  selectedLabelIds,
  onToggleLabel,
  onClearAll,
  onAddReply,
  onChangeStatus,
}: {
  posts: Post[]
  replies: Reply[]
  labels: Label[]
  selectedLabelIds: string[]
  onToggleLabel: (labelId: string) => void
  onClearAll: () => void
  onAddReply: (reply: Reply) => void
  onChangeStatus: (postId: string, status: PostStatus) => void
}) {
  // 完了した投稿はタイムラインに流し続けない（企画書 §8 付録B 理由5）
  const activePosts = useMemo(
    () => posts.filter((p) => p.status !== "完了"),
    [posts],
  )

  const [mixEnabled, setMixEnabled] = useState(true)
  const [sortOrder, setSortOrder] = useState<SortOrder>("new")

  const sorted = useMemo(
    () => sortPosts(activePosts, sortOrder),
    [activePosts, sortOrder],
  )

  const matched = useMemo(
    () => filterPostsByLabels(sorted, selectedLabelIds),
    [sorted, selectedLabelIds],
  )

  const displayed = useMemo(() => {
    if (!mixEnabled || selectedLabelIds.length === 0) return matched
    return mixInOutsideRange(matched, sorted)
  }, [matched, sorted, mixEnabled, selectedLabelIds])

  return (
    <section className="timeline" aria-label="タイムライン">
      <LabelFilterBar
        labels={labels}
        selectedLabelIds={selectedLabelIds}
        onToggle={onToggleLabel}
        onClearAll={onClearAll}
      />

      <div className="timeline__controls">
        <label className="timeline__sort">
          並び順
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          >
            {(Object.keys(SORT_LABELS) as SortOrder[]).map((order) => (
              <option key={order} value={order}>
                {SORT_LABELS[order]}
              </option>
            ))}
          </select>
        </label>

        {selectedLabelIds.length > 0 && (
          <label className="timeline__mix-toggle">
            <input
              type="checkbox"
              checked={mixEnabled}
              onChange={(e) => setMixEnabled(e.target.checked)}
            />
            範囲外の投稿を混ぜる
          </label>
        )}
      </div>

      <ul className="timeline__list">
        {displayed.length === 0 && (
          <li className="timeline__empty">
            表示できる投稿がありません。ラベルを見直してください。
          </li>
        )}
        {displayed.map((post) => (
          <li key={post.id}>
            <PostCard
              post={post}
              replies={replies}
              onAddReply={onAddReply}
              onChangeStatus={onChangeStatus}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
