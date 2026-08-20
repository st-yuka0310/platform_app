import type { Label, LabelCategory } from "../types"

/**
 * ラベルのカテゴリ一覧。人に付くラベルと投稿に付くタグで共通（企画書 §4）。
 * カテゴリ別にまとめて表示したい場所（登録画面、ラベルを探すセクションなど）は
 * これをループして labelsInCategory と組み合わせる。
 */
export const LABEL_CATEGORIES: LabelCategory[] = [
  "学部",
  "学年",
  "履修科目",
  "課外活動",
  "関心",
  "キャンパス",
]

export function labelsInCategory(
  labels: Label[],
  category: LabelCategory,
): Label[] {
  return labels.filter((l) => l.category === category)
}
