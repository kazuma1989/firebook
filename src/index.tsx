import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { App } from "./App"
import "./color.css"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { GlobalSWRConfig } from "./components/GlobalSWRConfig"
import "./global.css"

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <GlobalSWRConfig>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GlobalSWRConfig>
    </ErrorBoundary>
  </React.StrictMode>,

  document.getElementById("root")
)
