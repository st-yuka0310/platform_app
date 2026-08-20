/**
 * プロフィール編集画面。
 *
 * ログイン中の本人が、キャンパス・学部・学年・履修科目・課外活動・関心を
 * あとから変更できるようにする。表示名とパスワードはここでは変更しない
 * （表示名はログインIDを兼ねているため）。保存できたらそのまま閉じる。
 */
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
  ProfileFields,
  validateProfileFields,
  type ProfileFieldsValue,
} from "./ProfileFields"

export function ProfileEditor({ onClose }: { onClose: () => void }) {
  const { currentUser, updateProfile } = useAuth()
  const [profile, setProfile] = useState<ProfileFieldsValue>(() => ({
    campus: currentUser?.campus ?? "荒牧",
    labelIds: currentUser?.labelIds ?? [],
    courses: currentUser?.courses ?? [],
  }))
  const [error, setError] = useState<string | null>(null)

  if (!currentUser) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const message = validateProfileFields(profile)
    if (message) {
      setError(message)
      return
    }
    const result = updateProfile(profile.campus, profile.labelIds, profile.courses)
    if (!result.ok) {
      setError(result.message ?? "エラーが発生しました")
      return
    }
    onClose()
  }

  return (
    <section className="login-form" aria-label="プロフィール編集">
      <h2 className="app__section-heading">プロフィール編集</h2>
      <p className="app__disclaimer">{currentUser.name} さんのプロフィール</p>

      <form onSubmit={handleSubmit}>
        <ProfileFields value={profile} onChange={setProfile} />

        {error && <p className="login-form__error">{error}</p>}

        <div className="post-form__actions">
          <button type="button" onClick={onClose}>
            閉じる
          </button>
          <button type="submit">保存する</button>
        </div>
      </form>
    </section>
  )
}
