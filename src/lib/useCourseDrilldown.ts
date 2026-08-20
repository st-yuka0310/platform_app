import { useState } from "react"
import type { Label } from "../types"
import { labelsInCategory } from "./labels"
import { sampleCourseInfos } from "../data/courseInfos"

/**
 * 履修科目を「学部・学年で先に絞り込んでから見せる」ための共通ロジック。
 * CourseFinder（検索タブ）・PostForm（投稿のタグ選択）・ProfileFields
 * （プロフィール編集の履修科目選択）の3箇所で同じ絞り込み方をするために
 * 切り出した。表示（チップだけか、シラバスまで見せるかなど）は
 * それぞれの呼び出し側に任せる。
 */
export function useCourseDrilldown(labels: Label[], query: string) {
  const [facultyFilter, setFacultyFilter] = useState("") // "" = すべて
  const [gradeFilter, setGradeFilter] = useState("")

  const faculties = labelsInCategory(labels, "学部")
  const grades = labelsInCategory(labels, "学年")

  // 学部・学年のどちらも選ばず、キーワードも入れていない状態では一覧を出さない。
  // 出してしまうと、ドリルダウンで防ぎたかった「一度に全件表示」に戻ってしまうため。
  const hasAnyFilter = facultyFilter !== "" || gradeFilter !== "" || query !== ""

  const narrowedCourses = sampleCourseInfos.filter(
    (ci) =>
      (!facultyFilter || ci.facultyId === facultyFilter) &&
      (!gradeFilter || ci.gradeId === gradeFilter),
  )

  const narrowedLabels = hasAnyFilter
    ? narrowedCourses
        .map((ci) => labels.find((l) => l.id === ci.labelId))
        .filter((l): l is Label => l !== undefined)
        .filter((l) => l.name.includes(query))
    : []

  return {
    facultyFilter,
    setFacultyFilter,
    gradeFilter,
    setGradeFilter,
    faculties,
    grades,
    hasAnyFilter,
    narrowedLabels,
  }
}
