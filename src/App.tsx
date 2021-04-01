import { Route, Switch } from "react-router-dom"
import { GlobalHeader } from "./components/GlobalHeader"
import { GlobalLayout } from "./components/GlobalLayout"
import { useMockAuth } from "./hooks/useMockAuth"
import { PageHome } from "./pages/PageHome"
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
  const auth = useMockAuth()

  if (!auth.authenticated) {
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

  return (
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
  )
}
