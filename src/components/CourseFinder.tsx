/**
 * 履修科目専用の探し方。他のカテゴリ（学部・課外活動・関心・キャンパスなど）は
 * LabelSearch.tsx のフラットなチップ＋キーワードのままでよいが、履修科目だけは
 * 現実には数千件になりうるため、学部・学年で先に絞り込んでから見せる。
 *
 * 「投稿を絞り込むためにチップを選ぶ」操作と「シラバスを見る」操作は完全に別。
 * シラバスは、チップの隣にある ⓘ ボタンを押したときだけ、一覧の下に
 * 共有パネルとして1つだけ表示する（複数選んでも積み重ならない）。
 */
import { useState } from "react"
import type { Label, Post, PostStatus, Reply } from "../types"
import { labelsInCategory } from "../lib/labels"
import { sampleCourseInfos } from "../data/courseInfos"
import { CourseInfoCard } from "./CourseInfoCard"
import { PostCard } from "./PostCard"

export function CourseFinder({
  labels,
  selectedLabelIds,
  onToggle,
  query,
  posts,
  replies,
  onAddReply,
  onChangeStatus,
}: {
  labels: Label[]
  selectedLabelIds: string[]
  onToggle: (labelId: string) => void
  query: string
  posts: Post[]
  replies: Reply[]
  onAddReply: (reply: Reply) => void
  onChangeStatus: (postId: string, status: PostStatus) => void
}) {
  const [facultyFilter, setFacultyFilter] = useState("") // "" = すべて
  const [gradeFilter, setGradeFilter] = useState("")
  const [viewingLabelId, setViewingLabelId] = useState<string | null>(null)

  const faculties = labelsInCategory(labels, "学部")
  const grades = labelsInCategory(labels, "学年")
  const selected = new Set(selectedLabelIds)

  const narrowedCourses = sampleCourseInfos.filter(
    (ci) =>
      (!facultyFilter || ci.facultyId === facultyFilter) &&
      (!gradeFilter || ci.gradeId === gradeFilter),
  )

  // 学部・学年のどちらも選ばず、キーワードも入れていない状態では一覧を出さない。
  // 出してしまうと、ドリルダウンで防ぎたかった「一度に全件表示」に戻ってしまうため。
  const hasAnyFilter = facultyFilter !== "" || gradeFilter !== "" || query !== ""

  const narrowedLabels = hasAnyFilter
    ? narrowedCourses
        .map((ci) => labels.find((l) => l.id === ci.labelId))
        .filter((l): l is Label => l !== undefined)
        .filter((l) => l.name.includes(query))
    : []

  const viewingInfo = viewingLabelId
    ? sampleCourseInfos.find((c) => c.labelId === viewingLabelId)
    : undefined

  const matchingPosts = viewingLabelId
    ? posts.filter(
        (p) => p.direction === "提供します" && p.tagLabelIds.includes(viewingLabelId),
      )
    : []

  return (
    <div className="course-finder">
      <p className="label-filter-bar__heading">履修科目</p>

      <div className="course-finder__filters">
        <select
          value={facultyFilter}
          onChange={(e) => setFacultyFilter(e.target.value)}
          aria-label="学部で絞り込む"
        >
          <option value="">学部：すべて</option>
          {faculties.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          aria-label="学年で絞り込む"
        >
          <option value="">学年：すべて</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {!hasAnyFilter ? (
        <p className="course-finder__empty">
          学部・学年を選ぶか、キーワードを入力してください。
        </p>
      ) : narrowedLabels.length === 0 ? (
        <p className="course-finder__empty">該当する科目がありません。</p>
      ) : (
        <div className="course-finder__list">
          {narrowedLabels.map((label) => {
            const isOn = selected.has(label.id)
            const isViewing = viewingLabelId === label.id
            return (
              <span key={label.id} className="course-finder__item">
                <button
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
                <button
                  type="button"
                  className={
                    isViewing
                      ? "course-finder__info-btn course-finder__info-btn--active"
                      : "course-finder__info-btn"
                  }
                  aria-label={`${label.name}のシラバスを見る`}
                  onClick={() => setViewingLabelId(label.id)}
                >
                  ⓘ
                </button>
              </span>
            )
          })}
        </div>
      )}

      {viewingInfo && (
        <div className="course-finder__detail">
          <CourseInfoCard info={viewingInfo} />

          <p className="course-finder__posts-heading">
            この科目の「提供します」投稿
          </p>
          {matchingPosts.length === 0 ? (
            <p className="timeline__empty">該当する投稿はありません。</p>
          ) : (
            <ul className="timeline__list">
              {matchingPosts.map((post) => (
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
          )}
        </div>
      )}
    </div>
  )
}
