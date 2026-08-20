/**
 * ログイン／新規登録画面。
 *
 * これは見た目のみのログインで、本当の認証ではない（企画書 §10 の延長）。
 * 新規登録時にプロフィール項目（キャンパス・学部・学年・履修科目・課外活動・
 * 関心）を選んでもらうことで、登録直後から §4 の絞り込みが意味を持つように
 * している。登録後もプロフィール編集からいつでも変更できる。
 */
import { useState } from "react"
import type { Campus } from "../types"
import { sampleUsers } from "../data/users"
import { useAuth } from "../context/AuthContext"
import { DEMO_ACCOUNT_PASSWORD } from "../lib/authStorage"
import {
  ProfileFields,
  validateProfileFields,
  type ProfileFieldsValue,
} from "./ProfileFields"

const DEFAULT_CAMPUS: Campus = "荒牧"

export function LoginForm() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [profile, setProfile] = useState<ProfileFieldsValue>({
    campus: DEFAULT_CAMPUS,
    labelIds: [],
    courses: [],
  })
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (mode === "register") {
      const message = validateProfileFields(profile)
      if (message) {
        setError(message)
        return
      }
    }

    const result =
      mode === "login"
        ? login(name, password)
        : register(
            name,
            password,
            profile.campus,
            profile.labelIds,
            profile.courses,
          )
    if (!result.ok) {
      setError(result.message ?? "エラーが発生しました")
    }
  }

  return (
    <div className="login-form">
      <h1 className="app__heading">学内タイムライン</h1>
      <p className="app__disclaimer">
        ※ これはデモ用の見た目のみのログインです。パスワードはこの端末の
        ブラウザに平文で保存され、実際には秘匿されません。
      </p>

      <form onSubmit={handleSubmit}>
        <label className="post-form__field">
          表示名
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label className="post-form__field">
          パスワード
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {mode === "register" && (
          <ProfileFields value={profile} onChange={setProfile} />
        )}

        {error && <p className="login-form__error">{error}</p>}

        <div className="post-form__actions">
          <button type="submit">{mode === "login" ? "ログイン" : "登録する"}</button>
        </div>
      </form>

      <button
        type="button"
        className="login-form__switch"
        onClick={() => {
          setMode(mode === "login" ? "register" : "login")
          setError(null)
        }}
      >
        {mode === "login" ? "アカウントを作る" : "ログイン画面に戻る"}
      </button>

      {mode === "login" && (
        <div className="login-form__demo">
          <p className="label-filter-bar__heading">
            デモ用アカウント（パスワードは共通で {DEMO_ACCOUNT_PASSWORD}）
          </p>
          <div className="post-form__tag-list">
            {sampleUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                className="label-chip label-chip--off"
                onClick={() => {
                  setError(null)
                  const result = login(u.name, DEMO_ACCOUNT_PASSWORD)
                  if (!result.ok) {
                    setError(result.message ?? "エラーが発生しました")
                  }
                }}
              >
                {u.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
