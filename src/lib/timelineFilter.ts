/**
 * 担当: B（タイムラインの表示と、ラベルによる絞り込み）
 *
 * 「自分に付いているラベル」と「投稿に付いているタグ」が
 * 1つでも重なっていれば、その投稿を表示する（企画書 §4）。
 *
 * 選んでいるラベルが1つもない（＝すべてオフ）ときは、
 * 全投稿を返す（企画書 §5 「すべてオフにすれば学内の全投稿が見えます」）。
 */
import type { Post } from "../types"

export function filterPostsByLabels(
  posts: Post[],
  selectedLabelIds: string[],
): Post[] {
  if (selectedLabelIds.length === 0) return posts

  const selected = new Set(selectedLabelIds)
  return posts.filter((post) =>
    post.tagLabelIds.some((labelId) => selected.has(labelId)),
  )
}
