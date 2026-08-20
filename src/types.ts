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

/** LABEL テーブル */
export interface Label {
  id: string
  name: string
  category: LabelCategory
}

/** USER テーブル。labelIds が USER_LABEL の中身にあたる */
export interface User {
  id: string
  name: string
  campus: Campus
  labelIds: string[]
}

/**
 * 投稿を分類する2軸（企画書 §3 の4マス）。
 * 以前は PostKind に「情報」もあったが、学内である必然性が
 * 一番弱いという理由で削った（README §3）。
 */
export type PostDirection = "提供します" | "求めています"
export type PostKind = "モノ" | "手伝い"

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

/**
 * COURSE_INFO テーブル。履修科目ラベルに付く授業情報（試験の有無・授業計画など）。
 * ANNOUNCEMENT と同じ固定サンプル扱いで、編集画面は作らない。
 *
 * 担当教員の連絡先（メール・電話・オフィスアワー等）に対応するフィールドは
 * 意図的に持たせていない。型に置き場がないことで、実在の教員の個人情報が
 * サンプルデータに紛れ込む余地をなくしている。
 */
export interface CourseInfo {
  id: string
  /** 対応する Label.id（category === "履修科目"） */
  labelId: string
  courseCode: string
  /** 架空の担当教員名 */
  instructor: string
  term: string
  targetGrade: string
  credits: number
  hasExam: boolean
  /** 試験の配点など。任意 */
  examWeight?: string
  /** 16回分の表ではなく、1つの文章にまとめる */
  scheduleOverview: string
  evaluationMethod: string
  textbook?: string
  syllabusOverview: string
}
