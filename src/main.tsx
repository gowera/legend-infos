import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App"
import { BrowserRouter } from "@/lib/router"
import "./styles.css"

const root = document.getElementById("root")

if (!root) {
  throw new Error("Élément racine #root introuvable.")
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
