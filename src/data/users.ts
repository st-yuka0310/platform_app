import type { User } from "../types"

/**
 * サンプル利用者。ログイン機能は作らない代わりに、
 * 画面上で「誰として見るか」をこの中から切り替える（企画書 §10）。
 * 名前は架空のもの。
 *
 * 履修科目だけは履修中/履修済みの状態を持つため labelIds ではなく
 * courses に分けている（他の学部・学年・課外活動・関心はこれまで通り labelIds）。
 */
export const sampleUsers: User[] = [
  {
    id: "u1",
    name: "佐藤 あかり",
    campus: "荒牧",
    labelIds: ["l-faculty-joho", "l-grade-3", "l-club-tennis"],
    courses: [{ labelId: "l-sub-toukei", status: "履修中" }],
  },
  {
    id: "u2",
    name: "鈴木 大和",
    campus: "荒牧",
    labelIds: ["l-faculty-joho", "l-grade-3", "l-int-ryugaku"],
    courses: [{ labelId: "l-sub-data", status: "履修中" }],
  },
  {
    id: "u3",
    name: "高橋 陸",
    campus: "桐生",
    // 旧データの「工学部」は新しい学部一覧にないため、最も近い「理工学部」に読み替え
    labelIds: ["l-faculty-rikou", "l-grade-3", "l-club-keion"],
    courses: [{ labelId: "l-sub-bisieki", status: "履修済み" }],
  },
  {
    id: "u4",
    name: "田中 美月",
    campus: "昭和",
    labelIds: ["l-faculty-kyoiku", "l-grade-2", "l-int-kyoshi"],
    courses: [],
  },
  {
    id: "u5",
    name: "伊藤 蓮",
    campus: "荒牧",
    labelIds: ["l-faculty-joho", "l-grade-3", "l-int-ryugaku", "l-int-daigakuin"],
    courses: [{ labelId: "l-sub-toukei", status: "履修済み" }],
  },
  {
    id: "u6",
    name: "渡辺 葵",
    campus: "桐生",
    labelIds: ["l-faculty-rikou", "l-grade-2", "l-club-tennis"],
    courses: [],
  },
]
