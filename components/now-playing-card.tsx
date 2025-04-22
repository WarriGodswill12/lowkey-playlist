"use client"

import { Music, Pause, Play } from "lucide-react"
import type { ChannelInfo } from "@/types"

interface NowPlayingCardProps {
  currentChannel: string
  channelsList: ChannelInfo[]
  isPlaying: boolean
  onTogglePlay: () => void
  onOpenChannelSheet: () => void
}

export default function NowPlayingCard({
  currentChannel,
  channelsList,
  isPlaying,
  onTogglePlay,
  onOpenChannelSheet,
}: NowPlayingCardProps) {
  const getCurrentChannelTitle = () => {
    const channel = channelsList.find((c) => c.id === currentChannel)
    return channel ? channel.title : "Unknown Channel"
  }

  return (
    <div
      id="now-playing-card"
      className="now-playing-card fixed bottom-5 right-5 bg-purple-500 border border-white/10 rounded-xl backdrop-blur-md text-white py-2 px-3 md:py-3 md:px-4 text-xs md:text-sm flex items-center gap-2 md:gap-2.5 shadow-xl z-[999] transition-transform duration-300 hover:scale-105 max-w-[calc(100vw-40px)]"
    >
      <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={onOpenChannelSheet}>
        <Music className="h-4 w-4 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-xs text-white/70">Now Playing</span>
          <span id="now-playing-text" className="truncate font-medium">
            {getCurrentChannelTitle()}
          </span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onTogglePlay()
        }}
        className="ml-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
    </div>
  )
}
