import { useCallback, useState } from "react"
import type { PostStatus, Reply } from "./types"
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
import { Timeline } from "./components/Timeline"
import "./App.css"
import "./App.additions.css"

function AppInner() {
  const { viewer } = useViewer()
  const { logout } = useAuth()
  const { posts, addPost, updatePost } = usePosts()
  const { replies, addReply } = useReplies()

  // 最初は、自分に付いているラベルで絞り込んだ状態から始める（企画書 §4）
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
    () => viewer.labelIds,
  )

  const toggleLabel = useCallback((labelId: string) => {
    setSelectedLabelIds((prev) =>
      prev.includes(labelId)
        ? prev.filter((id) => id !== labelId)
        : [...prev, labelId],
    )
  }, [])

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
