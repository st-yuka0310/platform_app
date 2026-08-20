/**
 * 履修科目ラベルに付く授業情報の表示。固定サンプルデータで、編集画面はない
 * （企画書 §10・付録B）。サンプルデータである旨は App.tsx の全体注記に
 * すでにあるので、ここでは重複させない。
 */
import type { CourseInfo } from "../types"

export function CourseInfoCard({ info }: { info: CourseInfo }) {
  return (
    <div className="course-info-card">
      <p className="course-info-card__header">
        {info.courseCode}／{info.term}／{info.targetGrade}／{info.credits}単位
      </p>

      <p className="course-info-card__exam">
        {info.hasExam ? "試験あり" : "試験なし"}
        {info.examWeight && `（${info.examWeight}）`}
      </p>

      <dl className="course-info-card__body">
        <dt>授業概要</dt>
        <dd>{info.syllabusOverview}</dd>

        <dt>授業計画</dt>
        <dd>{info.scheduleOverview}</dd>

        <dt>成績評価</dt>
        <dd>{info.evaluationMethod}</dd>

        {info.textbook && (
          <>
            <dt>教科書</dt>
            <dd>{info.textbook}</dd>
          </>
        )}
      </dl>

      <p className="course-info-card__instructor">担当：{info.instructor}</p>
    </div>
  )
}
