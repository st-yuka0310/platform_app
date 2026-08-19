/**
 * 担当: C（視点切り替え）
 *
 * ログイン機能の代わりに、「誰として見るか」を切り替えるための部品（企画書 §10）。
 * 切り替えると、§7 の非公開の返信の見え方が変わる。
 */
import { useViewer } from "../context/ViewerContext"

export function ViewerSwitcher() {
  const { viewerId, setViewerId, users } = useViewer()

  return (
    <label className="viewer-switcher">
      あなたは
      <select
        value={viewerId}
        onChange={(e) => setViewerId(e.target.value)}
        aria-label="誰として見るかを選ぶ"
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      として見ています
    </label>
  )
}
