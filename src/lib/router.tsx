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

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    const updatePathname = () => setPathname(window.location.pathname)
    window.addEventListener("popstate", updatePathname)
    return () => window.removeEventListener("popstate", updatePathname)
  }, [])

  const navigate = useCallback((to: string) => {
    window.history.pushState(null, "", to)
    setPathname(window.location.pathname)
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

    const destination = new URL(to, window.location.href)
    if (destination.origin !== window.location.origin) return

    event.preventDefault()
    navigate(`${destination.pathname}${destination.search}${destination.hash}`)
  }

  return <a {...props} href={to} target={target} onClick={handleClick} />
}
