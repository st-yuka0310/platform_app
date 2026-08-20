/**
 * 担当: B（タイムラインの表示と、ラベルによる絞り込み）
 *
 * ラベルで絞り込んだ投稿に、Cの担当（範囲外を2割まぜる）を適用してから並べる。
 */
import { useMemo, useState } from "react"
import type { Label, Post, PostStatus, Reply } from "../types"
import { filterPostsByLabels } from "../lib/timelineFilter"
import { mixInOutsideRange } from "../lib/timelineMix"
import {
  filterByCourseRequestMode,
  type CourseRequestMode,
} from "../lib/courseRequestFilter"
import { CourseRequestFilter } from "./CourseRequestFilter"
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

  // 「求めています」の投稿を、選んだモードに合わせて先に絞っておく
  const visiblePosts = useMemo(
    () => filterByCourseRequestMode(activePosts, courseRequestMode, myCourseLabelIds),
    [activePosts, courseRequestMode, myCourseLabelIds],
  )

  const [mixEnabled, setMixEnabled] = useState(true)

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

  return (
    <section className="timeline" aria-label="タイムライン">
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

      <CourseRequestFilter
        mode={courseRequestMode}
        onChange={onChangeCourseRequestMode}
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
