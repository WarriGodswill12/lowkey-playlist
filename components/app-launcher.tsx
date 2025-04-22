"use client"

import { useRef } from "react"
import Draggable from "react-draggable"

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
    <Draggable nodeRef={nodeRef} bounds="parent">
      <div ref={nodeRef} className="app-launcher fixed top-20 right-20 z-[1002] flex flex-col gap-3">
        <button
          id="pomodoro-launcher"
          className={`app-button w-[42px] h-[42px] rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30 flex justify-center items-center text-white cursor-pointer transition-all duration-200 shadow-lg hover:scale-110 hover:bg-purple-500/40 ${isPomodoroVisible ? "bg-purple-500" : ""}`}
          title="Pomodoro Timer"
          onClick={togglePomodoroPanel}
        >
          <i className="fas fa-clock"></i>
        </button>
        <button
          id="todo-launcher"
          className={`app-button w-[42px] h-[42px] rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30 flex justify-center items-center text-white cursor-pointer transition-all duration-200 shadow-lg hover:scale-110 hover:bg-purple-500/40 ${isTodoVisible ? "bg-purple-500" : ""}`}
          title="Todo List"
          onClick={toggleTodoPanel}
        >
          <i className="fas fa-tasks"></i>
        </button>
      </div>
    </Draggable>
  )
}
