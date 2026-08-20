/**
 * 担当: B（タイムラインの表示と、ラベルによる絞り込み）
 *
 * ラベルで絞り込んだ投稿に、Cの担当（範囲外を2割まぜる）を適用してから並べる。
 * 「提供します」「求めています」「🔍 ラベルを探す」の3タブに分けて表示する。
 *
 * 当初は「画面にタブは増やさない」（企画書 §5）方針だったが、投稿の見やすさと
 * ラベル検索の見やすさを優先し、タブ形式に変更した（README §5 参照）。
 */
import { useMemo, useState } from "react"
import type { Label, Post, PostDirection, PostStatus, Reply } from "../types"
import { filterPostsByLabels } from "../lib/timelineFilter"
import { mixInOutsideRange } from "../lib/timelineMix"
import { LabelSearch } from "./LabelSearch"
import { LabelFilterBar } from "./LabelFilterBar"
import { PostCard } from "./PostCard"

type Tab = PostDirection | "検索"

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
  const [activeTab, setActiveTab] = useState<Tab>("提供します")

  const sorted = useMemo(
    () =>
      [...activePosts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [activePosts],
  )

  const matched = useMemo(
    () => filterPostsByLabels(sorted, selectedLabelIds),
    [sorted, selectedLabelIds],
  )

  const displayed = useMemo(() => {
    if (!mixEnabled || selectedLabelIds.length === 0) return matched
    return mixInOutsideRange(matched, sorted)
  }, [matched, sorted, mixEnabled, selectedLabelIds])

  // 「提供します」「求めています」で見た目を分ける。
  // 混ぜる処理のあと（displayedが確定したあと）に分けるだけなので、
  // timelineFilter.ts / timelineMix.ts はどちらも変更していない。
  const offering = useMemo(
    () => displayed.filter((p) => p.direction === "提供します"),
    [displayed],
  )
  const wanted = useMemo(
    () => displayed.filter((p) => p.direction === "求めています"),
    [displayed],
  )

  const activePostsForTab = activeTab === "提供します" ? offering : wanted

  return (
    <section className="timeline" aria-label="タイムライン">
      <div className="timeline__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "提供します"}
          className={
            activeTab === "提供します"
              ? "timeline__tab timeline__tab--active"
              : "timeline__tab"
          }
          onClick={() => setActiveTab("提供します")}
        >
          提供します（{offering.length}）
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "求めています"}
          className={
            activeTab === "求めています"
              ? "timeline__tab timeline__tab--active"
              : "timeline__tab"
          }
          onClick={() => setActiveTab("求めています")}
        >
          求めています（{wanted.length}）
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "検索"}
          className={
            activeTab === "検索"
              ? "timeline__tab timeline__tab--active"
              : "timeline__tab"
          }
          onClick={() => setActiveTab("検索")}
        >
          🔍 ラベルを探す
        </button>
      </div>

      {activeTab === "検索" ? (
        <LabelSearch
          labels={labels}
          selectedLabelIds={selectedLabelIds}
          onToggle={onToggleLabel}
        />
      ) : (
        <>
          <LabelFilterBar
            labels={labels}
            selectedLabelIds={selectedLabelIds}
            onToggle={onToggleLabel}
            onClearAll={onClearAll}
          />

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

          <ul className="timeline__list">
            {activePostsForTab.length === 0 && (
              <li className="timeline__empty">
                該当する「{activeTab}」の投稿がありません。
              </li>
            )}
            {activePostsForTab.map((post) => (
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
        </>
      )}
    </section>
  )
}
