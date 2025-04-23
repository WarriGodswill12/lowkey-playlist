"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

interface LofiPlayerProps {
  currentChannel: string
  setPlayer: (player: any) => void
  isPlaying: boolean
}

export default function LofiPlayer({ currentChannel, setPlayer, isPlaying }: LofiPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const youtubeApiLoaded = useRef(false)
  const playerInstance = useRef<any>(null)

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

  useEffect(() => {
    if (playerInstance.current) {
      if (isPlaying) {
        playerInstance.current.playVideo()
      } else {
        playerInstance.current.pauseVideo()
      }
    }
  }, [isPlaying])

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
        disablekb: 1,
        cc_load_policy: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: (event: any) => {
          event.target.playVideo()
          setPlayer(event.target)
          playerInstance.current = event.target

          // Apply custom CSS to hide YouTube elements
          const iframe = event.target.getIframe()
          if (iframe) {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document
            if (iframeDocument) {
              const style = iframeDocument.createElement("style")
              style.textContent = `
                .ytp-chrome-top,
                .ytp-chrome-bottom,
                .ytp-gradient-top,
                .ytp-gradient-bottom,
                .ytp-show-cards-title,
                .ytp-pause-overlay,
                .ytp-youtube-button,
                .ytp-watermark {
                  display: none !important;
                }
                .ytp-share-button {
                  display: block !important;
                }
              `
              iframeDocument.head.appendChild(style)
            }
          }
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
      <style jsx global>{`
        /* Additional CSS to hide YouTube elements */
        iframe#lofi-player {
          opacity: 0.9;
        }
      `}</style>
    </>
  )
}
