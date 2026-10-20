import { createFileRoute } from "@tanstack/react-router"

import { readArticleImage } from "@/lib/articles.server"

export const Route = createFileRoute("/api/images/$key")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const result = await readArticleImage(params.key)
        if (!result) {
          return new Response("Image introuvable", { status: 404 })
        }
        const contentType = result.metadata?.contentType || "application/octet-stream"
        return new Response(result.data as ArrayBuffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        })
      },
    },
  },
})
