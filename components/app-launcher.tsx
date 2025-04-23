"use client"

import { useRef } from "react"
import { Clock, ListTodo } from "lucide-react"

interface AppLauncherProps {
  isPomodoroVisible: boolean
  isTodoVisible: boolean
  togglePomodoroPanel: () => void
  toggleTodoPanel: () => void
}

export default function AppLauncher({
  isPomodoroVisible,
  isTodoVisible,
  togglePomodoroPanel,
  toggleTodoPanel,
}: AppLauncherProps) {
  const nodeRef = useRef(null)

  return (
    <div ref={nodeRef} className="flex flex-row gap-3">
      <button
        id="pomodoro-launcher"
        className="w-10 h-10 rounded-full bg-[#9764c7] flex justify-center items-center text-white cursor-pointer transition-all duration-200 shadow-lg hover:bg-[#8754b7]"
        title="Pomodoro Timer"
        onClick={togglePomodoroPanel}
      >
        <Clock className="h-4 w-4" />
      </button>
      <button
        id="todo-launcher"
        className="w-10 h-10 rounded-full bg-[#9764c7] flex justify-center items-center text-white cursor-pointer transition-all duration-200 shadow-lg hover:bg-[#8754b7]"
        title="Todo List"
        onClick={toggleTodoPanel}
      >
        <ListTodo className="h-4 w-4" />
      </button>
    </div>
  )
}
