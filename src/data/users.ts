import type { User } from "../types"

/**
 * サンプル利用者。ログイン機能は作らない代わりに、
 * 画面上で「誰として見るか」をこの中から切り替える（企画書 §10）。
 * 名前は架空のもの。
 */
export const sampleUsers: User[] = [
  {
    id: "u1",
    name: "佐藤 あかり",
    campus: "荒牧",
    labelIds: ["l-fac-joho3", "l-sub-toukei", "l-club-tennis"],
  },
  {
    id: "u2",
    name: "鈴木 大和",
    campus: "荒牧",
    labelIds: ["l-fac-joho3", "l-sub-data", "l-int-ryugaku"],
  },
  {
    id: "u3",
    name: "高橋 陸",
    campus: "桐生",
    labelIds: ["l-fac-koga3", "l-sub-bisieki", "l-club-keion"],
  },
  {
    id: "u4",
    name: "田中 美月",
    campus: "昭和",
    labelIds: ["l-fac-kyoiku2", "l-int-kyoshi"],
  },
  {
    id: "u5",
    name: "伊藤 蓮",
    campus: "荒牧",
    labelIds: [
      "l-fac-joho3",
      "l-sub-toukei",
      "l-int-ryugaku",
      "l-int-daigakuin",
    ],
  },
  {
    id: "u6",
    name: "渡辺 葵",
    campus: "桐生",
    labelIds: ["l-fac-koga2", "l-club-tennis"],
  },
]
