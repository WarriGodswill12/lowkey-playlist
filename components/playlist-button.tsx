"use client"

import { List } from "lucide-react"

interface PlaylistButtonProps {
  onOpenChannelSheet: () => void
}

export default function PlaylistButton({ onOpenChannelSheet }: PlaylistButtonProps) {
  return (
    <div
      id="playlist-button"
      className="fixed bottom-5 left-5 bg-purple-500 border border-white/10 rounded-xl backdrop-blur-md text-white py-2 px-3 md:py-3 md:px-4 shadow-xl z-[999] transition-transform duration-300 hover:scale-105"
    >
      <button onClick={onOpenChannelSheet} className="flex items-center gap-2" aria-label="Open playlist">
        <List className="h-4 w-4" />
        <span className="text-sm font-medium">Playlist</span>
      </button>
    </div>
  )
}
