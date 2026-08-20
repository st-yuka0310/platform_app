/**
 * 「求めています」の投稿の表示切り替え（企画書 §4 の絞り込みとは別軸）。
 *
 * これまでは「求めています」の投稿が、講義タグの有無や履修状況に関わらず
 * 常にタイムラインへ全部出ていた。それを次の3通りから選べるようにする。
 *   - mine   : 自分が履修中・履修済みである講義タグが付いた投稿だけ見せる
 *              （講義タグの付いていない「求めています」投稿は見せない）
 *   - all    : 全部見せる（これまでの挙動）
 *   - hidden : 「求めています」の投稿を一切見せない
 *
 * 「提供します」の投稿には、このフィルタは影響しない。
 */
import type { Post } from "../types"

export type CourseRequestMode = "mine" | "all" | "hidden"

export function filterByCourseRequestMode(
  posts: Post[],
  mode: CourseRequestMode,
  myCourseLabelIds: string[],
): Post[] {
  if (mode === "all") return posts

  const mine = new Set(myCourseLabelIds)
  return posts.filter((post) => {
    if (post.direction !== "求めています") return true
    if (mode === "hidden") return false
    // mode === "mine": 自分が履修中・履修済みの講義タグが付いているものだけ通す
    return post.tagLabelIds.some((id) => mine.has(id))
  })
}
