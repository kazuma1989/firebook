import { Route, Switch } from "react-router-dom"
import { GlobalHeader } from "./components/GlobalHeader"
import { GlobalLayout } from "./components/GlobalLayout"
import { UserProvider } from "./hooks/useUser"
import { useUserState } from "./hooks/useUserState"
import { PageHome } from "./pages/PageHome"
import { PageLoading } from "./pages/PageLoading"
import { PageNotFound } from "./pages/PageNotFound"
import { PageProfile } from "./pages/PageProfile"
import { PageSignIn } from "./pages/PageSignIn"
import { PageSignUp } from "./pages/PageSignUp"

/**
 * アプリのエントリーポイント。
 *
 * 次のコンポーネントの配下に置く必要がある（直下でなくてもよい）。
 * - react-router-dom の BrowserRouter.
 */
export function App() {
  // TODO モック実装を本物にする。
  const { user, loading } = useUserState()

  if (loading) {
    return <PageLoading />
  }

  // user がないとき＝未サインイン状態。
  if (!user) {
    return (
      <Switch>
        <Route exact path="/sign-up">
          <PageSignUp />
        </Route>

        <Route>
          <PageSignIn />
        </Route>
      </Switch>
    )
  }

  // user があるとき＝サインイン済み状態。
  // コンテクストから user にアクセスできるようにする。
  return (
    <UserProvider value={user}>
      <GlobalLayout>
        <GlobalLayout.Header>
          <GlobalHeader />
        </GlobalLayout.Header>

        <GlobalLayout.Body>
          <Switch>
            <Route exact path="/">
              <PageHome />
            </Route>

            <Route exact path="/profile">
              <PageProfile />
            </Route>

            <Route>
              <PageNotFound />
            </Route>
          </Switch>
        </GlobalLayout.Body>
      </GlobalLayout>
    </UserProvider>
  )
}
