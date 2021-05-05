import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { App } from "./App"
import "./color.css"
import { ErrorBoundary } from "./components/ErrorBoundary"
import "./global.css"
import { MockAuth, MockAuthProvider } from "./hooks/useMockAuth"

const mockAuth = new MockAuth()

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <MockAuthProvider value={mockAuth}>
          <App />
        </MockAuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,

  document.getElementById("root")
)
