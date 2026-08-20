/**
 * 企画書 付録B「データの設計図」の ER 図をそのまま型にしたもの。
 *
 * USER_LABEL / POST_TAG は独立したテーブルとして図には描いているが、
 * フロントエンドで扱う分には User.labelIds / Post.tagLabelIds という
 * 配列に畳んだほうが素直なので、ここではそう表現している。
 * （中間テーブルの行を持ちたくなったら、その形に戻せばよい）
 */

/** キャンパス。ラベルの category="キャンパス" の名前とも一致させている */
export type Campus = "荒牧" | "桐生" | "昭和"

/** ラベルの分類。人にも投稿にも同じ分類を使う（企画書 §4） */
export type LabelCategory =
  | "学部"
  | "学年"
  | "履修科目"
  | "課外活動"
  | "関心"
  | "キャンパス"

/** 学部の固定4つ。プルダウンで単一選択する */
export type Faculty = "医学部" | "情報学部" | "教育学部" | "理工学部"

/** 学年もプルダウンで単一選択する */
export type Grade = "1年" | "2年" | "3年" | "4年"

/** 履修科目だけは「今取っているか、取り終えたか」を持つ（他のラベルにはない属性） */
export type CourseStatus = "履修中" | "履修済み"

/** USER_LABEL のうち、履修科目（category="履修科目"）についてだけ状態を持たせたもの */
export interface UserCourse {
  labelId: string
  status: CourseStatus
}

/** LABEL テーブル */
export interface Label {
  id: string
  name: string
  category: LabelCategory
}

/**
 * USER テーブル。
 * labelIds は学部・学年・課外活動・関心（状態を持たないラベル）の USER_LABEL。
 * 履修科目だけは履修中/履修済みの状態が要るため、courses に分けて持つ。
 */
export interface User {
  id: string
  name: string
  campus: Campus
  labelIds: string[]
  courses: UserCourse[]
}

/** 投稿を分類する2軸（企画書 §3 の6マス） */
export type PostDirection = "提供します" | "求めています"
export type PostKind = "モノ" | "手伝い" | "情報"

/** 受け渡しが済んだ投稿をタイムラインから止めるための状態（企画書 §8 付録B 理由5） */
export type PostStatus = "募集中" | "やり取り中" | "完了"

/** POST テーブル。tagLabelIds が POST_TAG の中身にあたる */
export interface Post {
  id: string
  authorId: string
  direction: PostDirection
  kind: PostKind
  title: string
  body: string
  /** モノのときだけ使う */
  price?: number
  place: string
  status: PostStatus
  tagLabelIds: string[]
  createdAt: string
  /** 最終編集日時。新規投稿時は createdAt と同じ値にする */
  updatedAt: string
}

/**
 * REPLY テーブル。公開・非公開の違いは isPrivate だけ（企画書 §7）。
 * 非公開のとき見られるのは、投稿者（Post.authorId）とこの返信の書き手だけ。
 */
export interface Reply {
  id: string
  postId: string
  authorId: string
  body: string
  isPrivate: boolean
  createdAt: string
}

/** ANNOUNCEMENT テーブル。ラベルとは繋がっておらず、常に全員に表示する（企画書 §6） */
export interface Announcement {
  id: string
  title: string
  body: string
  publishedAt: string
}
