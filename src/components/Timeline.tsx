/**
 * 担当: B（タイムラインの表示と、ラベルによる絞り込み）
 *
 * ラベルで絞り込んだ投稿に、Cの担当（範囲外を2割まぜる）を適用してから並べる。
 * 「提供します」「求めています」の2タブに分けて表示する。
 *
 * 「🔍 ラベルを探す」はこの2つとは階層を分けている。提供します/求めていますは
 * 中身を見るタブ（コンテンツビュー）だが、ラベルを探すのは中身を見るための
 * 条件を作る道具（フィルターの設定）で、性質が違う。同じタブ列に並べると
 * 3つの同格な画面があるように見えてしまうため、右下の固定アイコンから
 * オーバーレイで開く形にした。
 *
 * 当初は「画面にタブは増やさない」（企画書 §5）方針だったが、投稿の見やすさを
 * 優先してタブ形式に変更した（README §5 参照）。
 */
import { useMemo, useState } from "react"
import type { Label, Post, PostDirection, PostStatus, Reply } from "../types"
import { filterPostsByLabels } from "../lib/timelineFilter"
import { mixInOutsideRange } from "../lib/timelineMix"
import {
  filterByCourseRequestMode,
  type CourseRequestMode,
} from "../lib/courseRequestFilter"
import { CourseRequestFilter } from "./CourseRequestFilter"
import { LabelSearch } from "./LabelSearch"
import { LabelFilterBar } from "./LabelFilterBar"
import { PostCard } from "./PostCard"

export function Timeline({
  posts,
  replies,
  labels,
  selectedLabelIds,
  onToggleLabel,
  onClearAll,
  onAddReply,
  onChangeStatus,
  enrolledCourseLabelIds,
  onToggleEnrolledCourses,
  myClubLabelIds,
  onToggleMyClubs,
  myCourseLabelIds,
  courseRequestMode,
  onChangeCourseRequestMode,
}: {
  posts: Post[]
  replies: Reply[]
  labels: Label[]
  selectedLabelIds: string[]
  onToggleLabel: (labelId: string) => void
  onClearAll: () => void
  onAddReply: (reply: Reply) => void
  onChangeStatus: (postId: string, status: PostStatus) => void
  enrolledCourseLabelIds: string[]
  onToggleEnrolledCourses: () => void
  myClubLabelIds: string[]
  onToggleMyClubs: () => void
  /** 自分が履修中・履修済み（どちらでも）である講義のラベルID一覧 */
  myCourseLabelIds: string[]
  courseRequestMode: CourseRequestMode
  onChangeCourseRequestMode: (mode: CourseRequestMode) => void
}) {
  // 完了した投稿はタイムラインに流し続けない（企画書 §8 付録B 理由5）
  const activePosts = useMemo(
    () => posts.filter((p) => p.status !== "完了"),
    [posts],
  )

  // 「求めています」の投稿を、選んだモードに合わせて先に絞っておく。
  // 「提供します」には影響しない（lib/courseRequestFilter.ts参照）
  const visiblePosts = useMemo(
    () =>
      filterByCourseRequestMode(activePosts, courseRequestMode, myCourseLabelIds),
    [activePosts, courseRequestMode, myCourseLabelIds],
  )

  const [mixEnabled, setMixEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState<PostDirection>("提供します")
  const [searchOpen, setSearchOpen] = useState(false)

  const sorted = useMemo(
    () =>
      [...visiblePosts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [visiblePosts],
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

  // 検索オーバーレイから「提供します」「求めています」に移動したら、
  // オーバーレイは閉じて結果がそのまま見えるようにする
  function handleViewTab(tab: PostDirection) {
    setActiveTab(tab)
    setSearchOpen(false)
  }

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
      </div>

      <LabelFilterBar
        labels={labels}
        selectedLabelIds={selectedLabelIds}
        onToggle={onToggleLabel}
        onClearAll={onClearAll}
        enrolledCourseLabelIds={enrolledCourseLabelIds}
        onToggleEnrolledCourses={onToggleEnrolledCourses}
        myClubLabelIds={myClubLabelIds}
        onToggleMyClubs={onToggleMyClubs}
      />

      {activeTab === "求めています" && (
        <CourseRequestFilter
          mode={courseRequestMode}
          onChange={onChangeCourseRequestMode}
        />
      )}

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

      <button
        type="button"
        className="label-search-fab"
        aria-label="ラベルを探す"
        onClick={() => setSearchOpen(true)}
      >
        🔍
      </button>

      {searchOpen && (
        <div
          className="label-search-overlay"
          role="dialog"
          aria-label="ラベルを探す"
        >
          <div className="label-search-overlay__backdrop" onClick={() => setSearchOpen(false)} />
          <div className="label-search-overlay__panel">
            <div className="label-search-overlay__header">
              <p className="label-search-overlay__title">🔍 ラベルを探す</p>
              <button
                type="button"
                className="label-search-overlay__close"
                onClick={() => setSearchOpen(false)}
              >
                閉じる
              </button>
            </div>
            <LabelSearch
              labels={labels}
              selectedLabelIds={selectedLabelIds}
              onToggle={onToggleLabel}
              posts={activePosts}
              replies={replies}
              onAddReply={onAddReply}
              onChangeStatus={onChangeStatus}
              offeringCount={offering.length}
              wantedCount={wanted.length}
              onViewTab={handleViewTab}
            />
          </div>
        </div>
      )}
    </section>
  )
}
