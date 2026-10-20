import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"

import Header from "@/components/Header"
import Footer from "@/components/Footer"

import "../styles.css"

const siteName = "LEGEND — L'information au cœur de l'action citoyenne"
const siteDescription =
  "LEGEND est un média d'information en ligne dédié à l'actualité, à l'investigation, au débat public et à la promotion de l'action citoyenne."

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: siteName },
      { name: "description", content: siteDescription },
      { property: "og:title", content: siteName },
      { property: "og:description", content: siteDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "icon", href: "/legend-logo.jpeg" }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-black">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}
