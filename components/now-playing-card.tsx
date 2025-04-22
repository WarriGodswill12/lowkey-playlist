"use client"

import type { ChannelInfo } from "@/types"

interface NowPlayingCardProps {
  currentChannel: string
  channelsList: ChannelInfo[]
}

export default function NowPlayingCard({ currentChannel, channelsList }: NowPlayingCardProps) {
  const getCurrentChannelTitle = () => {
    const channel = channelsList.find((c) => c.id === currentChannel)
    return channel ? channel.title : "Unknown Channel"
  }

  return (
    <div
      id="now-playing-card"
      className="now-playing-card fixed bottom-5 right-5 bg-purple-500 border border-white/10 rounded-xl backdrop-blur-md text-white py-3 px-4 text-sm flex items-center gap-2.5 shadow-xl cursor-pointer z-[999] transition-transform duration-300 hover:scale-105"
      onClick={() => {
        const dock = document.getElementById("dock")
        if (dock) dock.classList.add("visible")
      }}
    >
      <i className="fas fa-music"></i>
      <span id="now-playing-text">{getCurrentChannelTitle()}</span>
    </div>
  )
}
