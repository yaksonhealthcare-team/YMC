import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import "./styles/fonts.css"

// 개발 환경에서만 StrictMode 사용
const AppWithStrictMode = import.meta.env.DEV ? (
  <React.StrictMode>
    <App />
  </React.StrictMode>
) : (
  <App />
)

ReactDOM.createRoot(document.getElementById("root")!).render(AppWithStrictMode)
