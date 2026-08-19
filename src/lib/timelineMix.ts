/**
 * 担当: C（偏りの対処。範囲外の投稿を2割まぜる仕組み）
 *
 * 選んだラベルに合わない投稿を、結果の約2割まぜて差し込む（企画書 §8）。
 * 数字は出さず、混ぜること自体で視野の偏りに対処する方針。
 *
 * v0: ランダムに選んで一定間隔で差し込んでいるだけ。
 *      「見ていないカテゴリを優先する」など、混ぜ方の工夫はここを直せばよい。
 */
import type { Post } from "../types"

export function mixInOutsideRange(
  matchedPosts: Post[],
  allPosts: Post[],
  ratio = 0.2,
): Post[] {
  if (matchedPosts.length === 0) return matchedPosts

  const matchedIds = new Set(matchedPosts.map((p) => p.id))
  const outsidePosts = shuffle(allPosts.filter((p) => !matchedIds.has(p.id)))
  if (outsidePosts.length === 0) return matchedPosts

  const mixCount = Math.max(1, Math.round(matchedPosts.length * ratio))
  const toMix = outsidePosts.slice(0, mixCount)

  const result = [...matchedPosts]
  const step = Math.max(1, Math.floor(result.length / toMix.length))
  toMix.forEach((post, i) => {
    const insertAt = Math.min(result.length, (i + 1) * step + i)
    result.splice(insertAt, 0, post)
  })
  return result
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}
