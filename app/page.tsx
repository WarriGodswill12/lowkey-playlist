"use client"

import { useEffect, useState } from "react"
import Logo from "@/components/logo"
import LofiPlayer from "@/components/lofi-player"
import AppLauncher from "@/components/app-launcher"
import Dock from "@/components/dock"
import NowPlayingCard from "@/components/now-playing-card"
import PomodoroWindow from "@/components/pomodoro-window"
import TodoWindow from "@/components/todo-window"
import SettingsPanel from "@/components/settings-panel"
import type { Settings, Task, List } from "@/types"
import { channelsList } from "@/data/channels"

export default function Home() {
  // State variables
  const [player, setPlayer] = useState<any>(null)
  const [currentChannel, setCurrentChannel] = useState("M-4zE2GG87w") // Default channel
  const [isMuted, setIsMuted] = useState(false)
  const [isPomodoroVisible, setIsPomodoroVisible] = useState(false)
  const [isTodoVisible, setIsTodoVisible] = useState(false)
  const [isSettingsVisible, setIsSettingsVisible] = useState(false)
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
    }
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

  return (
    <main className="min-h-screen">
      {backgroundElements}

      <Logo />

      <LofiPlayer currentChannel={currentChannel} setPlayer={setPlayer} />

      <AppLauncher
        isPomodoroVisible={isPomodoroVisible}
        isTodoVisible={isTodoVisible}
        togglePomodoroPanel={togglePomodoroPanel}
        toggleTodoPanel={toggleTodoPanel}
      />

      <Dock currentChannel={currentChannel} onChangeChannel={handleChangeChannel} channelsList={channelsList} />

      <NowPlayingCard currentChannel={currentChannel} channelsList={channelsList} />

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
