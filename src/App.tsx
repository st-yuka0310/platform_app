import { useCallback, useMemo, useState } from "react"
import type { PostStatus, Reply } from "./types"
import type { CourseRequestMode } from "./lib/courseRequestFilter"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ViewerProvider, useViewer } from "./context/ViewerContext"
import { usePosts } from "./hooks/usePosts"
import { useReplies } from "./hooks/useReplies"
import { sampleLabels } from "./data/labels"
import { sampleAnnouncements } from "./data/announcements"
import { resetToSampleData } from "./lib/storage"
import { AnnouncementBanner } from "./components/AnnouncementBanner"
import { LoginForm } from "./components/LoginForm"
import { PostForm } from "./components/PostForm"
import { PostManager } from "./components/PostManager"
import { ProfileEditor } from "./components/ProfileEditor"
import { Timeline } from "./components/Timeline"
import "./App.css"
import "./App.additions.css"

function AppInner() {
  const { viewer } = useViewer()
  const { logout } = useAuth()
  const { posts, addPost, updatePost, deletePost } = usePosts()
  const { replies, addReply } = useReplies()
  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const [showPostManager, setShowPostManager] = useState(false)

  // 自分が今「履修中」にしている科目のラベルID（「履修済み」は含まない）。
  // 履修中/履修済み機能を追加する前のlocalStorageデータが残っていると
  // viewer.courses が undefined になることがあるため、?? [] で防いでいる。
  const enrolledCourseLabelIds = useMemo(
    () =>
      (viewer.courses ?? [])
        .filter((c) => c.status === "履修中")
        .map((c) => c.labelId),
    [viewer.courses],
  )

  // 自分が所属しているサークル（課外活動）のラベルID
  const myClubLabelIds = useMemo(() => {
    const clubIds = new Set(
      sampleLabels.filter((l) => l.category === "課外活動").map((l) => l.id),
    )
    return viewer.labelIds.filter((id) => clubIds.has(id))
  }, [viewer.labelIds])

  // 自分が履修中・履修済み、どちらかである講義のラベルID
  // （「求めています」の講義投稿の表示切り替えに使う。履修中だけの enrolledCourseLabelIds とは別物）
  const myCourseLabelIds = useMemo(
    () => (viewer.courses ?? []).map((c) => c.labelId),
    [viewer.courses],
  )
  const [courseRequestMode, setCourseRequestMode] =
    useState<CourseRequestMode>("all")

  // 最初は、自分に付いているラベル＋履修中の科目で絞り込んだ状態から始める（企画書 §4）
  // （所属サークルは labelIds に含まれているのですでに入っている）
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(() => [
    ...viewer.labelIds,
    ...enrolledCourseLabelIds,
  ])

  const toggleLabel = useCallback((labelId: string) => {
    setSelectedLabelIds((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    )
  }, [])

  // 複数のラベルIDをまとめてオン/オフする（全部選択済みなら全部外す、そうでなければ全部選ぶ）
  function toggleGroup(ids: string[]) {
    setSelectedLabelIds((prev) => {
      const allSelected = ids.every((id) => prev.includes(id))
      if (allSelected) {
        const remove = new Set(ids)
        return prev.filter((id) => !remove.has(id))
      }
      const toAdd = ids.filter((id) => !prev.includes(id))
      return [...prev, ...toAdd]
    })
  }

  const toggleEnrolledCourses = useCallback(
    () => toggleGroup(enrolledCourseLabelIds),
    [enrolledCourseLabelIds],
  )
  const toggleMyClubs = useCallback(
    () => toggleGroup(myClubLabelIds),
    [myClubLabelIds],
  )

  const clearAll = useCallback(() => setSelectedLabelIds([]), [])

  const handleChangeStatus = useCallback(
    (postId: string, status: PostStatus) => updatePost(postId, { status }),
    [updatePost],
  )

  const handleAddReply = useCallback(
    (reply: Reply) => addReply(reply),
    [addReply],
  )

  function handleReset() {
    if (!confirm("投稿と返信を、最初のサンプルデータの状態に戻します。よろしいですか？")) {
      return
    }
    resetToSampleData()
    location.reload()
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__heading">学内タイムライン</h1>
        <div className="app__header-controls">
          <span className="app__current-user">{viewer.name} としてログイン中</span>
          <button
            type="button"
            onClick={() =>
              setShowProfileEditor((v) => {
                if (!v) setShowPostManager(false)
                return !v
              })
            }
          >
            {showProfileEditor ? "プロフィール編集を閉じる" : "プロフィール編集"}
          </button>
          <button
            type="button"
            onClick={() =>
              setShowPostManager((v) => {
                if (!v) setShowProfileEditor(false)
                return !v
              })
            }
          >
            {showPostManager ? "投稿の編集を閉じる" : "投稿を編集"}
          </button>
          <button type="button" onClick={logout}>
            ログアウト
          </button>
          <button type="button" className="app__reset" onClick={handleReset}>
            サンプルデータに戻す
          </button>
        </div>
      </header>

      <p className="app__disclaimer">
        ※ このページのデータはすべてサンプルです。実際の学内サービスではありません。
      </p>

      {showProfileEditor && (
        <ProfileEditor onClose={() => setShowProfileEditor(false)} />
      )}

      {showPostManager && (
        <PostManager
          posts={posts}
          labels={sampleLabels}
          onUpdatePost={updatePost}
          onDeletePost={deletePost}
          onClose={() => setShowPostManager(false)}
        />
      )}

      <AnnouncementBanner announcements={sampleAnnouncements} />

      <section className="app__section app__section--post" aria-label="投稿する">
        <h2 className="app__section-heading">投稿する</h2>
        <PostForm labels={sampleLabels} onAddPost={addPost} />
      </section>

      <section className="app__section app__section--timeline" aria-label="タイムライン">
        <h2 className="app__section-heading">タイムライン</h2>
        <Timeline
          posts={posts}
          replies={replies}
          labels={sampleLabels}
          selectedLabelIds={selectedLabelIds}
          onToggleLabel={toggleLabel}
          onClearAll={clearAll}
          onAddReply={handleAddReply}
          onChangeStatus={handleChangeStatus}
          enrolledCourseLabelIds={enrolledCourseLabelIds}
          onToggleEnrolledCourses={toggleEnrolledCourses}
          myClubLabelIds={myClubLabelIds}
          onToggleMyClubs={toggleMyClubs}
          myCourseLabelIds={myCourseLabelIds}
          courseRequestMode={courseRequestMode}
          onChangeCourseRequestMode={setCourseRequestMode}
        />
      </section>
    </div>
  )
}

function AppGate() {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <LoginForm />
  }

  return (
    <ViewerProvider>
      <AppInner />
    </ViewerProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  )
}
