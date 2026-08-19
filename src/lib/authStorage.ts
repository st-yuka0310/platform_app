import type { Campus, User } from "../types"

/**
 * ログイン機能（自由登録方式）。
 *
 * 企画書 §10 は「ログイン機能を作らない」判断をしているが、ここでは
 * その代わりとして「見た目だけ」の登録・ログインを追加する。
 * サーバーがないため、パスワードは平文で localStorage に残り、
 * 技術的な秘匿性はない（§10 の非公開の返信と同じ制約）。
 *
 * sampleUsers（既存の6人のサンプル利用者）とは別に、ここで登録した
 * アカウントが本当の User として扱われる。新規登録者にはラベルが
 * 付いていない状態から始まるので、絞り込み（§4）を試すには登録時に
 * ラベルを選んでもらう。
 */

const ACCOUNTS_KEY = "platform_app:accounts"
const SESSION_KEY = "platform_app:session"

interface Account {
  id: string
  name: string
  password: string
  campus: Campus
  labelIds: string[]
}

type AccountTable = Record<string, Account> // key = name

function loadAccounts(): AccountTable {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    return raw ? (JSON.parse(raw) as AccountTable) : {}
  } catch {
    return {}
  }
}

function saveAccounts(accounts: AccountTable): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function toUser(account: Account): User {
  return {
    id: account.id,
    name: account.name,
    campus: account.campus,
    labelIds: account.labelIds,
  }
}

export function registerAccount(
  name: string,
  password: string,
  campus: Campus,
  labelIds: string[],
): { ok: true; user: User } | { ok: false; message: string } {
  const trimmed = name.trim()
  if (!trimmed || !password) {
    return { ok: false, message: "表示名とパスワードを入力してください" }
  }
  const accounts = loadAccounts()
  if (accounts[trimmed]) {
    return { ok: false, message: "その表示名はすでに使われています" }
  }
  const account: Account = {
    id: `u-${crypto.randomUUID()}`,
    name: trimmed,
    password,
    campus,
    labelIds,
  }
  accounts[trimmed] = account
  saveAccounts(accounts)
  localStorage.setItem(SESSION_KEY, trimmed)
  return { ok: true, user: toUser(account) }
}

export function loginAccount(
  name: string,
  password: string,
): { ok: true; user: User } | { ok: false; message: string } {
  const accounts = loadAccounts()
  const account = accounts[name.trim()]
  if (!account || account.password !== password) {
    return { ok: false, message: "表示名またはパスワードが違います" }
  }
  localStorage.setItem(SESSION_KEY, account.name)
  return { ok: true, user: toUser(account) }
}

export function logoutAccount(): void {
  localStorage.removeItem(SESSION_KEY)
}

/** 起動時にセッションを復元する。ログイン中でなければ null */
export function restoreSession(): User | null {
  const name = localStorage.getItem(SESSION_KEY)
  if (!name) return null
  const accounts = loadAccounts()
  const account = accounts[name]
  return account ? toUser(account) : null
}

/**
 * 登録済みアカウントを User の形で一覧取得する。
 * sampleUsers（既存6人）とは別の集合なので、投稿者名の表示などで
 * sampleUsers と合わせて参照する（lib/format.ts の userName 参照）。
 */
export function listAccountUsers(): User[] {
  return Object.values(loadAccounts()).map(toUser)
}
