"use client"

import { useState, useEffect, useRef } from "react"
import Draggable from "react-draggable"
import type { Settings } from "@/types"

interface PomodoroWindowProps {
  onClose: () => void
  settings: Settings
  pomodoroCount: number
  onUpdatePomodoroCount: (count: number) => void
  onShowSettings: () => void
}

export default function PomodoroWindow({
  onClose,
  settings,
  pomodoroCount,
  onUpdatePomodoroCount,
  onShowSettings,
}: PomodoroWindowProps) {
  const nodeRef = useRef(null)
  const [currentMode, setCurrentMode] = useState("pomodoro")
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const particleIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Timer durations for each mode (in seconds)
  const timerDurations = {
    pomodoro: settings.pomodoro * 60,
    shortBreak: settings.shortBreak * 60,
    longBreak: settings.longBreak * 60,
  }

  // Initialize timer
  useEffect(() => {
    setTimeLeft(timerDurations[currentMode as keyof typeof timerDurations])

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current)
      }
    }
  }, [currentMode, settings])

  // Request notification permission on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission()
      }
    }
  }, [])

  // Toggle timer start/pause
  const toggleTimer = () => {
    if (isTimerRunning) {
      pauseTimer()
    } else {
      startTimer()
    }
  }

  // Start the timer
  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true)

      // Start the timer interval
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current as NodeJS.Timeout)
            timerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Start particle animation
      if (currentMode === "pomodoro") {
        startParticleAnimation()
      }
    }
  }

  // Pause the timer
  const pauseTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false)
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current)
      }
    }
  }

  // Reset the timer
  const resetTimer = () => {
    pauseTimer()
    setTimeLeft(timerDurations[currentMode as keyof typeof timerDurations])
  }

  // Timer completed
  const timerComplete = () => {
    setIsTimerRunning(false)

    // Play sound
    if (settings.soundEnabled) {
      playTimerEndSound()
    }

    // Show notification
    displayNotification()

    // Update pomodoro count and progress dots
    if (currentMode === "pomodoro") {
      const newCount = pomodoroCount + 1
      onUpdatePomodoroCount(newCount)

      // After 4 pomodoros, take a long break
      if (newCount % 4 === 0) {
        setNotificationMessage("Great job! Time for a long break.")
        changeTimerMode("longBreak")
      } else {
        setNotificationMessage("Pomodoro completed! Take a short break.")
        changeTimerMode("shortBreak")
      }
    } else {
      // After a break, go back to pomodoro
      setNotificationMessage("Break is over. Time to focus!")
      changeTimerMode("pomodoro")
    }
  }

  // Display notification
  const displayNotification = () => {
    // Show in-app notification
    const message = currentMode === "pomodoro" ? "Time for a break!" : "Break is over, back to work!"
    setNotificationMessage(message)
    setShowNotification(true)

    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 5000)

    // Show browser notification
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        const title = currentMode === "pomodoro" ? "Time for a break!" : "Break is over, back to work!"

        new Notification("Lowkey Lofi Timer", {
          body: title,
          icon: "/favicon.ico",
        })
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            displayNotification()
          }
        })
      }
    }
  }

  // Change timer mode (pomodoro/shortBreak/longBreak)
  const changeTimerMode = (mode: string) => {
    // Reset timer
    pauseTimer()

    // Update mode
    setCurrentMode(mode)
    setTimeLeft(timerDurations[mode as keyof typeof timerDurations])
  }

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Play timer end sound
  const playTimerEndSound = () => {
    let soundUrl

    // Pick sound URL based on theme
    switch (settings.soundTheme) {
      case "digital":
        soundUrl = "https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3"
        break
      case "nature":
        soundUrl = "https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3"
        break
      default: // minimal
        soundUrl = "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-alert-248.mp3"
    }

    const audio = new Audio(soundUrl)
    audio.play()
  }

  // Start particle animation for pomodoro timer
  const startParticleAnimation = () => {
    if (!isTimerRunning && currentMode !== "pomodoro") return

    const createParticle = () => {
      const container = document.getElementById("particles-container")
      if (!container) return

      // Create particle
      const particle = document.createElement("div")
      particle.className = "particle"

      // Random position along the bottom
      const posX = Math.random() * 100
      particle.style.left = `${posX}%`

      // Random size
      const size = Math.random() * 4 + 2
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`

      // Random duration
      const duration = Math.random() * 2 + 2
      particle.style.setProperty("--duration", `${duration}s`)

      // Add to container
      container.appendChild(particle)

      // Remove after animation completes
      setTimeout(() => {
        particle.remove()
      }, duration * 1000)
    }

    // Create initial particle
    createParticle()

    // Create particles at intervals
    particleIntervalRef.current = setInterval(() => {
      if (isTimerRunning && currentMode === "pomodoro") {
        createParticle()
      }
    }, 300)
  }

  return (
    <>
      <Draggable nodeRef={nodeRef} bounds="parent" defaultPosition={{ x: 20, y: 20 }}>
        <div
          ref={nodeRef}
          id="pomodoro-window"
          className="mini-window w-[90vw] md:w-[300px] bg-[rgba(46,26,71,0.8)] text-white rounded-2xl p-4 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:absolute md:top-5 md:right-5 md:left-auto md:translate-y-0 z-[9999] backdrop-blur-md border border-white/10 shadow-md select-none cursor-move"
        >
          <div className="header flex justify-between items-center mb-2.5 cursor-move">
            <div className="header-left flex items-center">
              <div className="app-title text-lg font-medium">Pomodoro Timer</div>
            </div>
            <div className="close-btn text-base cursor-pointer" onClick={onClose}>
              ×
            </div>
          </div>

          {/* Progress Dots */}
          <div className="progress-dots flex gap-[0.3rem] justify-center mb-3">
            <div
              className={`dot w-2 h-2 rounded-full bg-white/30 ${pomodoroCount % 4 >= 1 ? "active bg-white opacity-100" : "opacity-30"}`}
            ></div>
            <div
              className={`dot w-2 h-2 rounded-full bg-white/30 ${pomodoroCount % 4 >= 2 ? "active bg-white opacity-100" : "opacity-30"}`}
            ></div>
            <div
              className={`dot w-2 h-2 rounded-full bg-white/30 ${pomodoroCount % 4 >= 3 ? "active bg-white opacity-100" : "opacity-30"}`}
            ></div>
          </div>

          {/* Timer Display */}
          <div className="timer-display relative mb-6 py-12 px-4 bg-gradient-to-r from-purple-500/10 to-purple-500/20 border border-purple-500/30 rounded-xl overflow-hidden min-h-[120px] flex flex-col items-center justify-center">
            <div id="particles-container" className="timer-particles absolute inset-0 z-[1] overflow-hidden"></div>
            <div className="timer-time relative z-[2] font-mono text-5xl font-bold tracking-widest text-white">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Timer Controls */}
          <div className="timer-controls flex justify-center items-center gap-4 mb-6">
            <button
              className="control-button secondary flex items-center justify-center border-none rounded-full cursor-pointer transition-all duration-200 bg-white/10 border border-purple-500/20 text-white p-3 backdrop-blur-sm hover:bg-white/15"
              id="reset-btn"
              onClick={resetTimer}
            >
              <svg
                className="icon w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
            </button>
            <button
              className="control-button primary flex items-center justify-center border-none rounded-full cursor-pointer transition-all duration-200 bg-[rgba(26,26,46,0.7)] text-white py-3 px-6 min-w-[7rem] font-bold border border-white/10 hover:bg-[rgba(26,26,46,0.9)]"
              id="start-pause-btn"
              onClick={toggleTimer}
            >
              <span id="start-pause-text">{isTimerRunning ? "Pause" : "Start"}</span>
            </button>
            <button
              className="control-button secondary flex items-center justify-center border-none rounded-full cursor-pointer transition-all duration-200 bg-white/10 border border-purple-500/20 text-white p-3 backdrop-blur-sm hover:bg-white/15"
              id="settings-btn"
              onClick={onShowSettings}
            >
              <svg
                className="icon w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>

          {/* Timer Tabs */}
          <div className="timer-tabs flex border-t border-[#4a2b5c]/30">
            <button
              className={`flex-1 py-4 text-center text-sm relative transition-all duration-300 ${
                currentMode === "pomodoro" ? "text-white font-medium border-b-2 border-[#9764c7]" : "text-white/60"
              }`}
              onClick={() => changeTimerMode("pomodoro")}
            >
              Pomodoro
            </button>
            <button
              className={`flex-1 py-4 text-center text-sm relative transition-all duration-300 ${
                currentMode === "shortBreak" ? "text-white font-medium border-b-2 border-[#9764c7]" : "text-white/60"
              }`}
              onClick={() => changeTimerMode("shortBreak")}
            >
              Short Break
            </button>
            <button
              className={`flex-1 py-4 text-center text-sm relative transition-all duration-300 ${
                currentMode === "longBreak" ? "text-white font-medium border-b-2 border-[#9764c7]" : "text-white/60"
              }`}
              onClick={() => changeTimerMode("longBreak")}
            >
              Long Break
            </button>
          </div>
        </div>
      </Draggable>

      {/* Timer Notification Popup */}
      {showNotification && (
        <div className="fixed top-4 right-4 left-4 md:left-auto md:w-80 bg-purple-500 text-white p-4 rounded-lg shadow-lg z-[999999] animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span className="font-medium">{notificationMessage}</span>
            </div>
            <button onClick={() => setShowNotification(false)} className="text-white/80 hover:text-white">
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}
