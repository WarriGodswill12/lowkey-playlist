"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Image from "next/image"
import { X, Heart } from "lucide-react"
import type { ChannelInfo } from "@/types"
import { toggleFavorite, getFavoriteChannels } from "@/data/channels"

interface ChannelSheetProps {
  isOpen: boolean
  onClose: () => void
  currentChannel: string
  onChangeChannel: (videoId: string) => void
  channelsList: ChannelInfo[]
}

export default function ChannelSheet({
  isOpen,
  onClose,
  currentChannel,
  onChangeChannel,
  channelsList,
}: ChannelSheetProps) {
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all")
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    // Load favorites
    const favs = getFavoriteChannels()
    setFavorites(favs.map((f) => f.id))
  }, [isOpen])

  const handleToggleFavorite = (channelId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const isFav = toggleFavorite(channelId)

    if (isFav) {
      setFavorites((prev) => [...prev, channelId])
    } else {
      setFavorites((prev) => prev.filter((id) => id !== channelId))
    }
  }

  const displayedChannels =
    activeTab === "favorites" ? channelsList.filter((channel) => favorites.includes(channel.id)) : channelsList

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[99999] transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-[#1a1a2e]/95 backdrop-blur-lg border-t border-purple-500/20 rounded-t-2xl shadow-lg max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <h2 className="text-lg font-medium text-white">Lofi Channels</h2>
          <div className="flex items-center gap-4">
            <div className="flex rounded-xl overflow-hidden border border-purple-500/30">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-1.5 text-sm rounded-l-xl ${activeTab === "all" ? "bg-purple-500 text-white" : "bg-white/10 text-gray-300"}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("favorites")}
                className={`px-4 py-1.5 text-sm rounded-r-xl ${activeTab === "favorites" ? "bg-purple-500 text-white" : "bg-white/10 text-gray-300"}`}
              >
                Favorites
              </button>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        <div className="channel-sheet-content overflow-y-auto max-h-[60vh] p-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {displayedChannels.length === 0 && activeTab === "favorites" ? (
              <div className="col-span-full text-center py-8 text-gray-300">
                <p>No favorite channels yet</p>
                <p className="text-sm mt-2 opacity-70">Click the heart icon on any channel to add it to favorites</p>
              </div>
            ) : (
              displayedChannels.map((channel) => (
                <div
                  key={channel.id}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                    currentChannel === channel.id
                      ? "bg-purple-500/30 border border-purple-500/50"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <button
                    onClick={() => {
                      onChangeChannel(channel.id)
                      onClose()
                    }}
                    className="w-full h-full flex flex-col items-center"
                    title={channel.title}
                  >
                    <div className="w-12 h-12 flex items-center justify-center mb-2 rounded-full bg-white/10">
                      <Image width={24} height={24} src={channel.icon || "/placeholder.svg"} alt={channel.title} />
                    </div>
                    <span className="text-xs text-center text-white truncate w-full">{channel.title}</span>
                  </button>
                  <button
                    onClick={(e) => handleToggleFavorite(channel.id, e)}
                    className="absolute top-1 right-1 p-1 rounded-full hover:bg-white/10"
                  >
                    <Heart
                      className={`h-4 w-4 ${favorites.includes(channel.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                    />
                  </button>
                </div>
              ))
            )}

            <button
              onClick={() => {
                // Get random channel
                const randomIndex = Math.floor(Math.random() * channelsList.length)
                onChangeChannel(channelsList[randomIndex].id)
                onClose()
              }}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-2 rounded-full bg-white/10">
                <Image width={24} height={24} src="https://img.icons8.com/ios-filled/50/shuffle.png" alt="shuffle" />
              </div>
              <span className="text-xs text-center text-white">Random</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
