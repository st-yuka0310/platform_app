import type { CourseInfo } from "../types"

/**
 * サンプルの授業情報。「履修科目」ラベル（統計学・データ構造・微積）に1件ずつ対応する。
 *
 * 構成（科目番号・試験の有無・授業計画・教科書・評価方法など）は、実在の
 * シラバスの「形」を参考にしているが、担当教員名は架空、連絡先は載せていない
 * （types.ts の CourseInfo にそもそも連絡先のフィールドがない）。
 */
export const sampleCourseInfos: CourseInfo[] = [
  {
    id: "ci1",
    labelId: "l-sub-toukei",
    courseCode: "ST2010",
    instructor: "中村 悠真",
    term: "前期",
    targetGrade: "2年次〜",
    credits: 2,
    hasExam: true,
    examWeight: "期末試験70%・小テスト30%",
    scheduleOverview:
      "全15回。記述統計から始め、確率分布、推定、仮説検定までを扱う。中盤に演習を交えた中間まとめを1回設ける。",
    evaluationMethod:
      "期末試験70%、授業内の小テスト30%の合計で評価する。",
    textbook: "特に指定しない。資料は授業内で配布する。",
    syllabusOverview:
      "統計学の基礎的な考え方と、データを扱う上で必要な確率・推測統計の手法を学ぶ。",
  },
  {
    id: "ci2",
    labelId: "l-sub-data",
    courseCode: "CS2050",
    instructor: "小林 蓮",
    term: "後期",
    targetGrade: "2年次〜",
    credits: 2,
    hasExam: true,
    examWeight: "期末試験60%・課題40%",
    scheduleOverview:
      "全15回。配列・連結リストから始まり、スタック・キュー、木構造、ハッシュ、探索・整列アルゴリズムまでを扱う。各回に簡単な実装課題を出す。",
    evaluationMethod: "期末試験60%、毎回の実装課題40%の合計で評価する。",
    textbook:
      "参考書として『データ構造とアルゴリズム』を紹介するが、購入は必須ではない。",
    syllabusOverview:
      "プログラムでよく使う基本的なデータ構造と、それに対応するアルゴリズムの考え方を、実装を通して学ぶ。",
  },
  {
    id: "ci3",
    labelId: "l-sub-bisieki",
    courseCode: "MA1010",
    instructor: "石田 悠",
    term: "前期",
    targetGrade: "1年次",
    credits: 2,
    hasExam: true,
    examWeight: "期末試験100%",
    scheduleOverview:
      "全15回。極限と連続性から始め、微分の基礎、積分の基礎、簡単な応用までを扱う。",
    evaluationMethod: "期末試験の得点のみで評価する。",
    textbook: "指定教科書あり。詳細は初回授業で案内する。",
    syllabusOverview:
      "理工系の基礎となる微分積分の考え方を、計算練習を中心に身につける。",
  },
]
