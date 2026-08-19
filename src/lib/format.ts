import { sampleLabels } from "../data/labels"
import { sampleUsers } from "../data/users"

const labelById = new Map(sampleLabels.map((l) => [l.id, l]))
const userById = new Map(sampleUsers.map((u) => [u.id, u]))

export function labelName(labelId: string): string {
  return labelById.get(labelId)?.name ?? labelId
}

export function userName(userId: string): string {
  return userById.get(userId)?.name ?? "不明な利用者"
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
