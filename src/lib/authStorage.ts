import type { Campus, User, UserCourse } from "../types"
import { sampleUsers } from "../data/users"

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
 * ラベルを選んでもらう。ログイン後はプロフィール編集からいつでも
 * 変更できる（updateAccount）。
 */

const ACCOUNTS_KEY = "platform_app:accounts"
const SESSION_KEY = "platform_app:session"

interface Account {
  id: string
  name: string
  password: string
  campus: Campus
  labelIds: string[]
  courses: UserCourse[]
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
    labelIds: account.labelIds ?? [],
    // 履修中/履修済み機能を追加する前に登録したアカウントには courses が
    // 存在しない（localStorage に古い形式のまま残っている）ことがあるため、
    // 無ければ空配列として扱う（真っ白画面になるのを防ぐ）
    courses: account.courses ?? [],
  }
}

export function registerAccount(
  name: string,
  password: string,
  campus: Campus,
  labelIds: string[],
  courses: UserCourse[],
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
    courses,
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
 * ログイン中の本人のプロフィール（キャンパス・学部・学年・履修科目・
 * 課外活動・関心）を書き換える。表示名とパスワードはここでは変更しない
 * （表示名はログインIDを兼ねているため）。
 */
export function updateAccount(
  name: string,
  updates: { campus: Campus; labelIds: string[]; courses: UserCourse[] },
): { ok: true; user: User } | { ok: false; message: string } {
  const accounts = loadAccounts()
  const account = accounts[name]
  if (!account) {
    return { ok: false, message: "アカウントが見つかりません" }
  }
  const updated: Account = { ...account, ...updates }
  accounts[name] = updated
  saveAccounts(accounts)
  return { ok: true, user: toUser(updated) }
}

/**
 * 登録済みアカウントを User の形で一覧取得する。
 * sampleUsers（既存6人）とは別の集合なので、投稿者名の表示などで
 * sampleUsers と合わせて参照する（lib/format.ts の userName 参照）。
 */
export function listAccountUsers(): User[] {
  return Object.values(loadAccounts()).map(toUser)
}

/** デモ用アカウントの共通パスワード。sampleUsers の誰でもこれでログインできる */
export const DEMO_ACCOUNT_PASSWORD = "demo1234"

/**
 * サンプルの6人（企画書のデモデータ）を、そのままログインできるアカウントとして
 * 種まきする。非公開の返信のデモ（p1 に対する u1・u6 からの返信など）は
 * この6人を前提にしているため、ログイン機能を入れた後もこの6人でログインして
 * 試せるようにしておく。アカウントが1件もないとき（初回起動時）だけ実行する。
 */
export function seedDemoAccountsIfEmpty(): void {
  const accounts = loadAccounts()
  if (Object.keys(accounts).length > 0) return

  const seeded: AccountTable = {}
  for (const user of sampleUsers) {
    seeded[user.name] = {
      id: user.id,
      name: user.name,
      password: DEMO_ACCOUNT_PASSWORD,
      campus: user.campus,
      labelIds: user.labelIds,
      courses: user.courses,
    }
  }
  saveAccounts(seeded)
}
