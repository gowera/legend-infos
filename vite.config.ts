import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

function getBasePath() {
  const requestedBase =
    process.env.SPA_LOADER_BASE_PATH ||
    process.env.VITE_BASE_PATH ||
    process.env.PUBLIC_URL ||
    process.env.BASE_URL ||
    "/"
  const trimmedBase = requestedBase.trim()

  if (!trimmedBase || trimmedBase === "/") return "/"
  if (trimmedBase.startsWith("./") || trimmedBase.startsWith("../")) {
    return trimmedBase.endsWith("/") ? trimmedBase : `${trimmedBase}/`
  }
  if (trimmedBase.includes("://") || trimmedBase.includes("?") || trimmedBase.includes("#")) {
    throw new Error("Le chemin de base Vite doit être un chemin, et non une URL complète.")
  }

  const path = trimmedBase.replace(/^\/+|\/+$/g, "")
  if (!path || path.split("/").some((segment) => segment === "." || segment === "..")) {
    throw new Error("Le chemin de base Vite n'est pas valide.")
  }
  return `/${path}/`
}

const config = defineConfig({
  base: getBasePath(),
  plugins: [
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    viteReact(),
  ],
})

export default config
