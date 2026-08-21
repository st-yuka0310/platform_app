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

  // p5（留学の体験談）は情報の投稿なので、公開のやり取りが自然に成立する例
  {
    id: "r3",
    postId: "p5",
    authorId: "u4",
    body: "費用はどれくらいかかりましたか？",
    isPrivate: false,
    createdAt: "2026-08-13T19:00:00+09:00",
  },
  {
    id: "r4",
    postId: "p5",
    authorId: "u2",
    body: "総額でだいたい80万円でした。内訳は奨学金の説明会でも聞けますよ。",
    isPrivate: false,
    createdAt: "2026-08-13T21:00:00+09:00",
  },

  // p6（教職課程）にも公開の返信
  {
    id: "r5",
    postId: "p6",
    authorId: "u1",
    body: "実習期間中はバイトを減らしている人が多いと聞きました。",
    isPrivate: false,
    // 匿名返信のデモ用。公開の返信でも名前を出さずに答えられることを示す
    isAnonymous: true,
    createdAt: "2026-08-14T09:00:00+09:00",
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

  // p21（データベースの演習、質問に答えます）に非公開で応募。
  // u5（伊藤蓮）の投稿に返信が付く、通知デモの例
  {
    id: "r7",
    postId: "p21",
    authorId: "u1",
    body: "来週の水曜、質問してもいいですか？",
    isPrivate: true,
    createdAt: "2026-08-19T20:00:00+09:00",
  },

  // p25（自転車の空気入れ貸します）に公開で質問。
  // u6（渡辺葵）の投稿に返信が付く、通知デモの例
  {
    id: "r8",
    postId: "p25",
    authorId: "u4",
    body: "何時ごろなら借りられますか？",
    isPrivate: false,
    createdAt: "2026-08-20T14:00:00+09:00",
  },
]
