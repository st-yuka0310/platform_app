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
