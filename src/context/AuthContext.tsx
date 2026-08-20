import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"
import type { Campus, User } from "../types"
import {
  loginAccount,
  logoutAccount,
  registerAccount,
  restoreSession,
} from "../lib/authStorage"

interface AuthResult {
  ok: boolean
  message?: string
}

interface AuthContextValue {
  /** ログイン中の User。未ログインなら null */
  currentUser: User | null
  login: (name: string, password: string) => AuthResult
  register: (
    name: string,
    password: string,
    campus: Campus,
    labelIds: string[],
  ) => AuthResult
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    restoreSession(),
  )

  function login(name: string, password: string): AuthResult {
    const result = loginAccount(name, password)
    if (!result.ok) return result
    setCurrentUser(result.user)
    return { ok: true }
  }

  function register(
    name: string,
    password: string,
    campus: Campus,
    labelIds: string[],
  ): AuthResult {
    const result = registerAccount(name, password, campus, labelIds)
    if (!result.ok) return result
    setCurrentUser(result.user)
    return { ok: true }
  }

  function logout() {
    logoutAccount()
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth は AuthProvider の内側で使ってください")
  }
  return ctx
}
