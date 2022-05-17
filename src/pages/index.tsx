import dynamic from "next/dynamic"
import React from "react"

const PhotoBooth = dynamic<{ size: number }>(
  () => import("components/PhotoBooth").then((m) => m.PhotoBooth),
  { ssr: false },
)

export default function HomePage() {
  return <PhotoBooth size={256} />
}
