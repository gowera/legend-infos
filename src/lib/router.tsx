import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react"

type RouterState = {
  pathname: string
  navigate: (to: string) => void
}

const RouterContext = createContext<RouterState | null>(null)
const BASE_PATH = import.meta.env.BASE_URL.startsWith("/")
  ? import.meta.env.BASE_URL.replace(/\/+$/, "")
  : ""

function getAppPath(pathname: string) {
  if (!BASE_PATH) return pathname
  if (pathname === BASE_PATH || pathname === `${BASE_PATH}/`) return "/"
  if (pathname.startsWith(`${BASE_PATH}/`)) return pathname.slice(BASE_PATH.length)
  return pathname
}

function getBaseHref(to: string) {
  if (!BASE_PATH || !to.startsWith("/") || to.startsWith("//")) return to
  return `${BASE_PATH}${to === "/" ? "/" : to}`
}

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => getAppPath(window.location.pathname))

  useEffect(() => {
    const updatePathname = () => setPathname(getAppPath(window.location.pathname))
    window.addEventListener("popstate", updatePathname)
    return () => window.removeEventListener("popstate", updatePathname)
  }, [])

  const navigate = useCallback((to: string) => {
    const href = getBaseHref(to)
    window.history.pushState(null, "", href)
    setPathname(getAppPath(window.location.pathname))
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  return (
    <RouterContext.Provider value={{ pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

function useRouter() {
  const router = useContext(RouterContext)
  if (!router) {
    throw new Error("Le composant doit être utilisé à l'intérieur de BrowserRouter.")
  }
  return router
}

export function usePathname() {
  return useRouter().pathname
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

export function Link({ to, onClick, target, ...props }: LinkProps) {
  const { navigate } = useRouter()
  const href = getBaseHref(to)

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === "_blank"
    ) {
      return
    }

    const destination = new URL(href, window.location.href)
    if (destination.origin !== window.location.origin) return

    event.preventDefault()
    navigate(`${getAppPath(destination.pathname)}${destination.search}${destination.hash}`)
  }

  return <a {...props} href={href} target={target} onClick={handleClick} />
}
