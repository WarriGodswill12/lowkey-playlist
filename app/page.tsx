"use client"

import { useEffect, useState } from "react"
import Logo from "@/components/logo"
import LofiPlayer from "@/components/lofi-player"
import AppLauncher from "@/components/app-launcher"
import NowPlayingCard from "@/components/now-playing-card"
import PomodoroWindow from "@/components/pomodoro-window"
import TodoWindow from "@/components/todo-window"
import SettingsPanel from "@/components/settings-panel"
import ChannelSheet from "@/components/channel-sheet"
import type { Settings, Task, List } from "@/types"
import { channelsList } from "@/data/channels"

export default function Home() {
  // State variables
  const [player, setPlayer] = useState<any>(null)
  const [currentChannel, setCurrentChannel] = useState("M-4zE2GG87w") // Default channel
  const [isPlaying, setIsPlaying] = useState(true)
  const [isPomodoroVisible, setIsPomodoroVisible] = useState(false)
  const [isTodoVisible, setIsTodoVisible] = useState(false)
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)
  const [isChannelSheetOpen, setIsChannelSheetOpen] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    soundEnabled: true,
    soundTheme: "minimal",
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [lists, setLists] = useState<List[]>([{ id: "default", name: "Main List", color: "#9764c7" }])
  const [activeListId, setActiveListId] = useState("default")
  const [currentFilter, setCurrentFilter] = useState("all")
  const [pomodoroCount, setPomodoroCount] = useState(0)

  // Background elements
  const backgroundElements = (
    <>
      <div className="fixed -top-32 -right-64 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      <div className="fixed -bottom-64 -left-64 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"></div>
    </>
  )

  // Load data from local storage
  useEffect(() => {
    try {
      // Load settings
      const storedSettings = localStorage.getItem("lofiAppSettings")
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings))
      }

      // Load tasks
      const storedTasks = localStorage.getItem("lofiAppTasks")
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks))
      }

      // Load lists
      const storedLists = localStorage.getItem("lofiAppLists")
      if (storedLists) {
        setLists(JSON.parse(storedLists))
      }

      // Load active list
      const storedActiveList = localStorage.getItem("lofiAppActiveList")
      if (storedActiveList) {
        setActiveListId(storedActiveList)
      }

      // Load filter
      const storedFilter = localStorage.getItem("lofiAppFilter")
      if (storedFilter) {
        setCurrentFilter(storedFilter)
      }

      // Load pomodoro count
      const storedCount = localStorage.getItem("lofiAppPomodoroCount")
      if (storedCount) {
        setPomodoroCount(Number.parseInt(storedCount))
      }
    } catch (error) {
      console.error("Error loading data from local storage:", error)
    }
  }, [])

  // Save data to local storage
  const saveDataToLocalStorage = () => {
    try {
      // Save settings
      localStorage.setItem("lofiAppSettings", JSON.stringify(settings))

      // Save tasks
      localStorage.setItem("lofiAppTasks", JSON.stringify(tasks))

      // Save lists
      localStorage.setItem("lofiAppLists", JSON.stringify(lists))

      // Save active list
      localStorage.setItem("lofiAppActiveList", activeListId)

      // Save filter
      localStorage.setItem("lofiAppFilter", currentFilter)

      // Save pomodoro count
      localStorage.setItem("lofiAppPomodoroCount", pomodoroCount.toString())
    } catch (error) {
      console.error("Error saving data to local storage:", error)
    }
  }

  // Change channel handler
  const handleChangeChannel = (videoId: string) => {
    setCurrentChannel(videoId)
    if (player && player.loadVideoById) {
      player.loadVideoById(videoId)
      setIsPlaying(true)
    }
  }

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Toggle pomodoro panel
  const togglePomodoroPanel = () => {
    setIsPomodoroVisible(!isPomodoroVisible)
  }

  // Toggle todo panel
  const toggleTodoPanel = () => {
    setIsTodoVisible(!isTodoVisible)
  }

  // Save settings handler
  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings)
    setIsSettingsVisible(false)
    saveDataToLocalStorage()
  }

  // Add task handler
  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task])
    saveDataToLocalStorage()
  }

  // Toggle task completion
  const handleToggleTaskCompletion = (taskId: number) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed }
      }
      return task
    })
    setTasks(updatedTasks)
    saveDataToLocalStorage()
  }

  // Clear completed tasks
  const handleClearCompletedTasks = () => {
    const updatedTasks = tasks.filter((task) => !task.completed)
    setTasks(updatedTasks)
    saveDataToLocalStorage()
  }

  // Change filter
  const handleChangeFilter = (filter: string) => {
    setCurrentFilter(filter)
    saveDataToLocalStorage()
  }

  // Change active list
  const handleChangeActiveList = (listId: string) => {
    setActiveListId(listId)
    saveDataToLocalStorage()
  }

  // Add new list
  const handleAddList = (list: List) => {
    setLists([...lists, list])
    saveDataToLocalStorage()
  }

  // Delete list
  const handleDeleteList = (listId: string) => {
    const updatedLists = lists.filter((list) => list.id !== listId)
    setLists(updatedLists)

    // Delete tasks associated with this list
    const updatedTasks = tasks.filter((task) => task.listId !== listId)
    setTasks(updatedTasks)

    // If active list was deleted, switch to default
    if (activeListId === listId) {
      setActiveListId("default")
    }

    saveDataToLocalStorage()
  }

  // Update pomodoro count
  const handleUpdatePomodoroCount = (count: number) => {
    setPomodoroCount(count)
    saveDataToLocalStorage()
  }

  // Add this useEffect to handle touch events for mobile
  useEffect(() => {
    // Request permission for notifications on mobile
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission()
    }

    // Prevent page scrolling when interacting with the app on mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (isPomodoroVisible || isTodoVisible || isSettingsVisible || isChannelSheetOpen) {
        // Allow scrolling within components but prevent body scrolling
        const target = e.target as HTMLElement
        const isScrollableElement =
          target.closest(".tasks-list") ||
          target.closest(".lists-container") ||
          target.closest(".modal-content") ||
          target.closest(".channel-sheet-content")

        if (!isScrollableElement) {
          e.preventDefault()
        }
      }
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false })

    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [isPomodoroVisible, isTodoVisible, isSettingsVisible, isChannelSheetOpen])

  return (
    <main className="min-h-screen">
      {backgroundElements}

      <Logo />

      <LofiPlayer currentChannel={currentChannel} setPlayer={setPlayer} isPlaying={isPlaying} />

      <AppLauncher
        isPomodoroVisible={isPomodoroVisible}
        isTodoVisible={isTodoVisible}
        togglePomodoroPanel={togglePomodoroPanel}
        toggleTodoPanel={toggleTodoPanel}
      />

      <NowPlayingCard
        currentChannel={currentChannel}
        channelsList={channelsList}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onOpenChannelSheet={() => setIsChannelSheetOpen(true)}
      />

      <ChannelSheet
        isOpen={isChannelSheetOpen}
        onClose={() => setIsChannelSheetOpen(false)}
        currentChannel={currentChannel}
        onChangeChannel={handleChangeChannel}
        channelsList={channelsList}
      />

      {isPomodoroVisible && (
        <PomodoroWindow
          onClose={() => setIsPomodoroVisible(false)}
          settings={settings}
          pomodoroCount={pomodoroCount}
          onUpdatePomodoroCount={handleUpdatePomodoroCount}
          onShowSettings={() => setIsSettingsVisible(true)}
        />
      )}

      {isTodoVisible && (
        <TodoWindow
          onClose={() => setIsTodoVisible(false)}
          tasks={tasks}
          lists={lists}
          activeListId={activeListId}
          currentFilter={currentFilter}
          onAddTask={handleAddTask}
          onToggleTaskCompletion={handleToggleTaskCompletion}
          onClearCompletedTasks={handleClearCompletedTasks}
          onChangeFilter={handleChangeFilter}
          onChangeActiveList={handleChangeActiveList}
          onAddList={handleAddList}
          onDeleteList={handleDeleteList}
        />
      )}

      {isSettingsVisible && (
        <SettingsPanel settings={settings} onClose={() => setIsSettingsVisible(false)} onSave={handleSaveSettings} />
      )}
    </main>
  )
}
