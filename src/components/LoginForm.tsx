/**
 * ログイン／新規登録画面。
 *
 * これは見た目のみのログインで、本当の認証ではない（企画書 §10 の延長）。
 * 新規登録時にラベルを選んでもらうことで、登録直後から §4 の絞り込みが
 * 意味を持つようにしている。
 *
 * 学部・学年は「人につき1つ」しかありえないため、他のラベル（複数選択の
 * チップ）とは別に、プルダウン（単一選択）で選ぶ。
 */
import { useState } from "react"
import type { Campus, Label, LabelCategory } from "../types"
import { sampleLabels } from "../data/labels"
import { sampleUsers } from "../data/users"
import { useAuth } from "../context/AuthContext"
import { DEMO_ACCOUNT_PASSWORD } from "../lib/authStorage"

const CAMPUSES: Campus[] = ["荒牧", "桐生", "昭和"]

// プルダウン（単一選択）で選ぶカテゴリ
const DROPDOWN_CATEGORIES: LabelCategory[] = ["学部", "学年"]

// チップ（複数選択）で選ぶカテゴリ。
// キャンパスは User.campus という専用フィールドがすでにあるのでここには含めない。
const MULTI_SELECT_CATEGORIES: LabelCategory[] = ["履修科目", "課外活動", "関心"]

function labelsInCategory(category: LabelCategory): Label[] {
  return sampleLabels.filter((l) => l.category === category)
}

export function LoginForm() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [campus, setCampus] = useState<Campus>("荒牧")
  const [labelIds, setLabelIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  function selectedIdIn(category: LabelCategory): string {
    const ids = new Set(labelsInCategory(category).map((l) => l.id))
    return labelIds.find((id) => ids.has(id)) ?? ""
  }

  function setDropdownValue(category: LabelCategory, labelId: string) {
    const ids = new Set(labelsInCategory(category).map((l) => l.id))
    setLabelIds((prev) => {
      const withoutCategory = prev.filter((id) => !ids.has(id))
      return labelId ? [...withoutCategory, labelId] : withoutCategory
    })
  }

  function toggleChip(labelId: string) {
    setLabelIds((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (mode === "register") {
      const missingCategory = DROPDOWN_CATEGORIES.find(
        (category) => !selectedIdIn(category),
      )
      if (missingCategory) {
        setError(`${missingCategory}を選んでください`)
        return
      }
    }

    const result =
      mode === "login"
        ? login(name, password)
        : register(name, password, campus, labelIds)
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
          <>
            <fieldset className="post-form__axis">
              <legend>キャンパス</legend>
              {CAMPUSES.map((c) => (
                <label key={c}>
                  <input
                    type="radio"
                    name="campus"
                    checked={campus === c}
                    onChange={() => setCampus(c)}
                  />
                  {c}
                </label>
              ))}
            </fieldset>

            {DROPDOWN_CATEGORIES.map((category) => (
              <label key={category} className="post-form__field">
                {category}
                <select
                  value={selectedIdIn(category)}
                  onChange={(e) => setDropdownValue(category, e.target.value)}
                  required
                >
                  <option value="">選択してください</option>
                  {labelsInCategory(category).map((label) => (
                    <option key={label.id} value={label.id}>
                      {label.name}
                    </option>
                  ))}
                </select>
              </label>
            ))}

            <fieldset className="post-form__tags">
              <legend>
                そのほか関係のあるラベルを選んでください（あとから変更はできません）
              </legend>
              {MULTI_SELECT_CATEGORIES.map((category) => (
                <div key={category}>
                  <p className="label-filter-bar__heading">{category}</p>
                  <div className="post-form__tag-list">
                    {labelsInCategory(category).map((label) => {
                      const isOn = labelIds.includes(label.id)
                      return (
                        <button
                          key={label.id}
                          type="button"
                          className={
                            isOn
                              ? "label-chip label-chip--on"
                              : "label-chip label-chip--off"
                          }
                          aria-pressed={isOn}
                          onClick={() => toggleChip(label.id)}
                        >
                          {label.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </fieldset>
          </>
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
