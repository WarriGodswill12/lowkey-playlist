"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

interface LofiPlayerProps {
  currentChannel: string
  setPlayer: (player: any) => void
}

export default function LofiPlayer({ currentChannel, setPlayer }: LofiPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const youtubeApiLoaded = useRef(false)

  useEffect(() => {
    // Define the YouTube API callback
    window.onYouTubeIframeAPIReady = () => {
      youtubeApiLoaded.current = true
      initializePlayer()
    }

    // Initialize player if API is already loaded
    if (window.YT && youtubeApiLoaded.current) {
      initializePlayer()
    }
  }, [])

  const initializePlayer = () => {
    if (!playerRef.current) return

    const player = new window.YT.Player(playerRef.current, {
      height: "100%",
      width: "100%",
      videoId: currentChannel,
      playerVars: {
        playsinline: 1,
        autoplay: 1,
        controls: 0,
        showinfo: 0,
        rel: 0,
        iv_load_policy: 3,
        fs: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (event: any) => {
          event.target.playVideo()
          setPlayer(event.target)
        },
        onStateChange: (event: any) => {
          // If video ends, restart it (for continuous play)
          if (event.data === window.YT.PlayerState.ENDED) {
            event.target.playVideo()
          }
        },
      },
    })
  }

  return (
    <>
      <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
      <div id="lofi-player" ref={playerRef} className="fixed inset-0 w-full h-full pointer-events-none"></div>
    </>
  )
}
