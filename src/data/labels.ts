import type { Label } from "../types"

/**
 * ラベル一覧。人に付くラベルと投稿に付くタグは同じこの一覧を共有する（企画書 §4）。
 * 履修科目を特別扱いせず、学部学年・課外活動・関心・キャンパスと同じ形で並べている。
 */
export const sampleLabels: Label[] = [
  { id: "l-fac-joho3", name: "情報学部3年", category: "学部学年" },
  { id: "l-fac-koga3", name: "工学部3年", category: "学部学年" },
  { id: "l-fac-koga2", name: "工学部2年", category: "学部学年" },
  { id: "l-fac-kyoiku2", name: "教育学部2年", category: "学部学年" },

  { id: "l-sub-toukei", name: "統計学", category: "履修科目" },
  { id: "l-sub-data", name: "データ構造", category: "履修科目" },
  { id: "l-sub-bisieki", name: "微積", category: "履修科目" },

  { id: "l-club-tennis", name: "テニス部", category: "課外活動" },
  { id: "l-club-keion", name: "軽音サークル", category: "課外活動" },

  { id: "l-int-ryugaku", name: "留学", category: "関心" },
  { id: "l-int-kyoshi", name: "教員志望", category: "関心" },
  { id: "l-int-daigakuin", name: "大学院進学", category: "関心" },

  { id: "l-campus-aramaki", name: "荒牧", category: "キャンパス" },
  { id: "l-campus-kiryu", name: "桐生", category: "キャンパス" },
  { id: "l-campus-showa", name: "昭和", category: "キャンパス" },
]
