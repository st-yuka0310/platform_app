import { sampleLabels } from "../data/labels"
import { sampleUsers } from "../data/users"
import { listAccountUsers } from "./authStorage"

const labelById = new Map(sampleLabels.map((l) => [l.id, l]))

export function labelName(labelId: string): string {
  return labelById.get(labelId)?.name ?? labelId
}

export function userName(userId: string): string {
  // サンプルの6人 + ログイン機能で新規登録されたアカウントの両方から探す。
  // 登録は実行中に増えていくので、都度アカウント一覧を読み直す。
  const fromSample = sampleUsers.find((u) => u.id === userId)
  if (fromSample) return fromSample.name
  const fromAccount = listAccountUsers().find((u) => u.id === userId)
  return fromAccount?.name ?? "不明な利用者"
}

/**
 * 投稿・返信の表示名を、匿名かどうかと「今見ている本人かどうか」を踏まえて決める。
 * 自分自身が書いたものは、匿名にしていても自分には実名のまま見える
 * （authorIdは変わらないので、内部の権限判定・非公開の返信の可視性には
 * 一切影響しない。表示だけを変えている）。
 */
export function displayAuthorName(
  authorId: string,
  isAnonymous: boolean | undefined,
  viewerId: string,
): string {
  if (isAnonymous && authorId !== viewerId) return "匿名"
  return userName(authorId)
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, "0")
  const mm = String(d.getMinutes()).padStart(2, "0")
  return `${d.getMonth() + 1}/${d.getDate()} ${hh}:${mm}`
}
