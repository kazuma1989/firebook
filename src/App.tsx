import { Route, Switch } from "react-router-dom"
import { GlobalHeader } from "./components/GlobalHeader"
import { GlobalLayout } from "./components/GlobalLayout"
import { CurrentUserProvider } from "./hooks/useCurrentUser"
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
  const { currentUser, loading } = useUserState()

  if (loading) {
    return <PageLoading />
  }

  // currentUser がないとき＝未サインイン状態。
  if (!currentUser) {
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

  // currentUser があるとき＝サインイン済み状態。
  // コンテクストから currentUser にアクセスできるようにする。
  return (
    <CurrentUserProvider value={currentUser}>
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
    </CurrentUserProvider>
  )
}
