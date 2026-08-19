import { createContext, useContext, useMemo } from "react"
import type { ReactNode } from "react"
import type { User } from "../types"
import { useAuth } from "./AuthContext"

/**
 * 「今アプリを誰として見ているか」。
 *
 * 以前はログイン機能の代わりにドロップダウンで自由に切り替えていたが、
 * ログイン機能を実装したことで、viewer はログイン中のアカウントと
 * 常に一致するようにした。人を切り替えたいときはログアウトして
 * 別のアカウントでログインし直す（本物の認証に近い動き）。
 *
 * PostForm / PostCard / ReplyThread など既存の利用側は
 * useViewer() の形をそのまま使えるよう、公開インターフェースは変えていない。
 */
interface ViewerContextValue {
  viewer: User
  viewerId: string
}

const ViewerContext = createContext<ViewerContextValue | null>(null)

/** ログイン済み（currentUser がある）ときだけ使う想定 */
export function ViewerProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth()

  const value = useMemo<ViewerContextValue>(() => {
    if (!currentUser) {
      throw new Error(
        "ViewerProvider はログイン後（currentUser がある状態）でのみ使ってください",
      )
    }
    return { viewer: currentUser, viewerId: currentUser.id }
  }, [currentUser])

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
