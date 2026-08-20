import type { Reply } from "../types"

/**
 * サンプル返信。公開・非公開の両方を最初から混ぜておくことで、
 * 「誰として見るか」を切り替えたときに違いが見えるようにしてある（企画書 §7）。
 */
export const sampleReplies: Reply[] = [
  // p1（微積の教科書）に、複数人からの非公開の返信がついている例
  {
    id: "r1",
    postId: "p1",
    authorId: "u6",
    body: "まだありますか？8/25の3限なら受け取りに行けます。",
    isPrivate: true,
    createdAt: "2026-08-11T09:00:00+09:00",
  },
  {
    id: "r2",
    postId: "p1",
    authorId: "u1",
    body: "私も気になっています。700円なら即決したいです。",
    isPrivate: true,
    createdAt: "2026-08-11T20:00:00+09:00",
  },

  // p13（関数電卓）は、状態を尋ねるだけの質問なので公開のやり取りが自然に成立する例
  {
    id: "r3",
    postId: "p13",
    authorId: "u1",
    body: "電池はまだ交換していないものですか？",
    isPrivate: false,
    createdAt: "2026-08-16T11:00:00+09:00",
  },
  {
    id: "r4",
    postId: "p13",
    authorId: "u3",
    body: "はい、去年入れ替えたばかりです。",
    isPrivate: false,
    createdAt: "2026-08-16T12:00:00+09:00",
  },

  // p3（引越し手伝い）にも公開の質問
  {
    id: "r5",
    postId: "p3",
    authorId: "u6",
    body: "何時集合の予定ですか？",
    isPrivate: false,
    createdAt: "2026-08-12T10:00:00+09:00",
  },

  // p4（実験の記録係）は手伝いの募集なので非公開で応募する例
  {
    id: "r6",
    postId: "p4",
    authorId: "u6",
    body: "できます。木曜3限は空いています。",
    isPrivate: true,
    createdAt: "2026-08-13T08:00:00+09:00",
  },
]
