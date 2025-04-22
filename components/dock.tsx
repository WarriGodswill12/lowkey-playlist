"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { ChannelInfo } from "@/types"

interface DockProps {
  currentChannel: string
  onChangeChannel: (videoId: string) => void
  channelsList: ChannelInfo[]
}

export default function Dock({ currentChannel, onChangeChannel, channelsList }: DockProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show dock when mouse moves to bottom of screen
    const handleMouseMove = (e: MouseEvent) => {
      const windowHeight = window.innerHeight
      const threshold = windowHeight - 100

      if (e.clientY > threshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      id="dock"
      className={`dock fixed bottom-4 left-1/2 -translate-x-1/2 scale-75 origin-bottom bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 md:p-4 flex justify-center items-center z-[1000] transition-all duration-300 opacity-50 pointer-events-none ${isVisible ? "visible scale-100 opacity-100 pointer-events-auto hover:scale-105" : ""}`}
    >
      <div className="minimized-icon">
        <Image
          width={50}
          height={50}
          src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/50/external-pomodoro-date-and-time-tanah-basah-glyph-tanah-basah.png"
          alt="pomodoro"
        />
      </div>
      <div className="dock-content flex items-center gap-2 md:gap-3 overflow-x-auto max-w-[90vw] pb-2">
        {channelsList.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onChangeChannel(channel.id)}
            title={channel.title}
            className={`bg-white/10 border border-white/20 rounded-lg w-8 h-8 md:w-9 md:h-9 flex-shrink-0 flex justify-center items-center transition-all duration-200 hover:bg-white/20 hover:scale-110 ${currentChannel === channel.id ? "active" : ""}`}
          >
            <Image width={20} height={20} src={channel.icon || "/placeholder.svg"} alt={channel.title} />
          </button>
        ))}
        <button
          onClick={() => {
            // Get random channel
            const randomIndex = Math.floor(Math.random() * channelsList.length)
            onChangeChannel(channelsList[randomIndex].id)
          }}
          title="Random Channel"
          className="bg-white/10 border border-white/20 rounded-lg w-8 h-8 md:w-9 md:h-9 flex-shrink-0 flex justify-center items-center transition-all duration-200 hover:bg-white/20 hover:scale-110"
        >
          <Image width={20} height={20} src="https://img.icons8.com/ios-filled/50/shuffle.png" alt="shuffle" />
        </button>
      </div>
    </div>
  )
}
