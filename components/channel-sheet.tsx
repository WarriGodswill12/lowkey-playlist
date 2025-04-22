"use client"
import Image from "next/image"
import { X } from "lucide-react"
import type { ChannelInfo } from "@/types"

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
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[9999999] transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-[#1a1a2e]/95 backdrop-blur-lg border-t border-purple-500/20 rounded-t-2xl shadow-lg max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <h2 className="text-lg font-medium text-white">Lofi Channels</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4">
          {channelsList.map((channel) => (
            <button
              key={channel.id}
              onClick={() => {
                onChangeChannel(channel.id)
                onClose()
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                currentChannel === channel.id
                  ? "bg-purple-500/30 border border-purple-500/50"
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-2 rounded-full bg-white/10">
                <Image width={24} height={24} src={channel.icon || "/placeholder.svg"} alt={channel.title} />
              </div>
              <span className="text-xs text-center text-white truncate w-full">{channel.title}</span>
            </button>
          ))}

          <button
            onClick={() => {
              // Get random channel
              const randomIndex = Math.floor(Math.random() * channelsList.length)
              onChangeChannel(channelsList[randomIndex].id)
              onClose()
            }}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
          >
            <div className="w-12 h-12 flex items-center justify-center mb-2 rounded-full bg-white/10">
              <Image width={24} height={24} src="https://img.icons8.com/ios-filled/50/shuffle.png" alt="shuffle" />
            </div>
            <span className="text-xs text-center text-white">Random</span>
          </button>
        </div>
      </div>
    </div>
  )
}
