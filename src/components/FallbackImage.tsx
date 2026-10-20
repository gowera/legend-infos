import { useEffect, useState, type ImgHTMLAttributes, type SyntheticEvent } from "react"

type FallbackImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string
  fallbackSrc?: string
}

export default function FallbackImage({
  src,
  fallbackSrc,
  onError,
  ...props
}: FallbackImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    setCurrentSrc(src)
    setHidden(false)
  }, [src])

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    onError?.(event)
    if (event.defaultPrevented) return

    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
    } else {
      setHidden(true)
    }
  }

  if (hidden) return null
  return <img {...props} src={currentSrc} onError={handleError} />
}
