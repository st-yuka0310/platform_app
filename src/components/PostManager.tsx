/**
 * 「投稿を編集」パネル。プロフィール編集・ログアウトと同じ要領で、
 * ヘッダーのボタンから開閉する。
 *
 * 自分の投稿だけを、最近の投稿順（最終編集日時つき）に見出しだけ並べる。
 * 見出しを開くと PostEditForm が出て、文面や状態の変更・削除ができる。
 */
import { useState } from "react"
import type { Label, Post } from "../types"
import { formatDateTime } from "../lib/format"
import { useViewer } from "../context/ViewerContext"
import { PostEditForm } from "./PostEditForm"

export function PostManager({
  posts,
  labels,
  onUpdatePost,
  onDeletePost,
  onClose,
}: {
  posts: Post[]
  labels: Label[]
  onUpdatePost: (id: string, patch: Partial<Post>) => void
  onDeletePost: (id: string) => void
  onClose: () => void
}) {
  const { viewerId } = useViewer()
  const [openPostId, setOpenPostId] = useState<string | null>(null)

  const myPosts = posts
    .filter((p) => p.authorId === viewerId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  function handleDelete(postId: string) {
    if (!confirm("この投稿を削除します。よろしいですか？")) return
    onDeletePost(postId)
    setOpenPostId(null)
  }

  return (
    <section className="login-form" aria-label="投稿を編集">
      <h2 className="app__section-heading">投稿を編集</h2>
      <p className="app__disclaimer">
        自分の投稿だけが、最近の投稿順に並びます。見出しを開くと文面や状態の変更・削除ができます。
      </p>

      {myPosts.length === 0 && (
        <p className="post-manager__empty">まだ投稿がありません。</p>
      )}

      <ul className="post-manager__list">
        {myPosts.map((post) => {
          const isOpen = openPostId === post.id
          return (
            <li key={post.id} className="post-manager__item">
              <button
                type="button"
                className="post-manager__summary"
                aria-expanded={isOpen}
                onClick={() => setOpenPostId(isOpen ? null : post.id)}
              >
                <span className="post-manager__title">{post.title}</span>
                <span className="post-manager__date">
                  {formatDateTime(post.updatedAt)}
                </span>
              </button>

              {isOpen && (
                <PostEditForm
                  post={post}
                  labels={labels}
                  onSave={(patch) => {
                    onUpdatePost(post.id, patch)
                    setOpenPostId(null)
                  }}
                  onDelete={() => handleDelete(post.id)}
                  onCancel={() => setOpenPostId(null)}
                />
              )}
            </li>
          )
        })}
      </ul>

      <div className="post-form__actions">
        <button type="button" onClick={onClose}>
          閉じる
        </button>
      </div>
    </section>
  )
}
