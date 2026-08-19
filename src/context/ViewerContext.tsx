import { createContext, useContext, useMemo, useState } from "react"
import type { ReactNode } from "react"
import type { User } from "../types"
import { sampleUsers } from "../data/users"

/**
 * ログイン機能を作らない代わりに、「今アプリを誰として見ているか」を
 * 画面上で切り替えられるようにする（企画書 §10）。
 *
 * §7 の非公開の返信や、B のラベル絞り込みは、ここで選ばれている
 * viewer を基準に判定する。
 */
interface ViewerContextValue {
  viewer: User
  viewerId: string
  setViewerId: (id: string) => void
  users: User[]
}

const ViewerContext = createContext<ViewerContextValue | null>(null)

export function ViewerProvider({ children }: { children: ReactNode }) {
  const [viewerId, setViewerId] = useState<string>(sampleUsers[0].id)

  const value = useMemo<ViewerContextValue>(() => {
    const viewer =
      sampleUsers.find((u) => u.id === viewerId) ?? sampleUsers[0]
    return { viewer, viewerId: viewer.id, setViewerId, users: sampleUsers }
  }, [viewerId])

  return (
    <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>
  )
}

export function useViewer(): ViewerContextValue {
  const ctx = useContext(ViewerContext)
  if (!ctx) {
    throw new Error("useViewer は ViewerProvider の内側で使ってください")
  }
  return ctx
}
