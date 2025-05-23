"use client"

import { useState, useRef } from "react"
import Draggable from "react-draggable"
import type { Task, List } from "@/types"
import ListsModal from "./lists-modal"
import EditTaskModal from "./edit-task-modal"
import { Calendar, TriangleAlert } from "lucide-react"

interface TodoWindowProps {
  onClose: () => void
  tasks: Task[]
  lists: List[]
  activeListId: string
  currentFilter: string
  onAddTask: (task: Task) => void
  onToggleTaskCompletion: (taskId: number) => void
  onClearCompletedTasks: () => void
  onChangeFilter: (filter: string) => void
  onChangeActiveList: (listId: string) => void
  onAddList: (list: List) => void
  onDeleteList: (listId: string) => void
}

export default function TodoWindow({
  onClose,
  tasks,
  lists,
  activeListId,
  currentFilter,
  onAddTask,
  onToggleTaskCompletion,
  onClearCompletedTasks,
  onChangeFilter,
  onChangeActiveList,
  onAddList,
  onDeleteList,
}: TodoWindowProps) {
  const nodeRef = useRef(null)
  const [newTaskText, setNewTaskText] = useState("")
  const [isListsModalOpen, setIsListsModalOpen] = useState(false)
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false)
  const [currentEditTask, setCurrentEditTask] = useState<Task | null>(null)

  // Get filtered tasks
  const getFilteredTasks = () => {
    // Filter by list
    let filteredTasks = tasks.filter((task) => task.listId === activeListId)

    // Apply additional filter
    if (currentFilter === "active") {
      filteredTasks = filteredTasks.filter((task) => !task.completed)
    } else if (currentFilter === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed)
    }

    return filteredTasks
  }

  // Add task
  const addTask = () => {
    if (newTaskText.trim() !== "") {
      // Create new task object
      const task: Task = {
        id: Date.now(),
        title: newTaskText.trim(),
        description: "",
        completed: false,
        dueDate: "",
        dueTime: "",
        priority: "medium",
        listId: activeListId,
      }

      // Add to tasks array
      onAddTask(task)

      // Clear input
      setNewTaskText("")
    }
  }

  // Format due date for display
  const formatDueDate = (dateStr: string, timeStr: string) => {
    if (!dateStr) return ""

    const date = new Date(dateStr)
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
    let formattedDate = date.toLocaleDateString("en-US", options)

    if (timeStr) {
      formattedDate += ` at ${timeStr}`
    }

    return formattedDate
  }

  // Check if due date is expired
  const isDueDateExpired = (dateStr: string, timeStr: string) => {
    if (!dateStr) return false

    const now = new Date()
    const dueDate = new Date(dateStr)

    if (timeStr) {
      const [hours, minutes] = timeStr.split(":").map(Number)
      dueDate.setHours(hours, minutes)
    } else {
      dueDate.setHours(23, 59, 59)
    }

    return now > dueDate
  }

  // Get active list name
  const getActiveListName = () => {
    const activeList = lists.find((list) => list.id === activeListId)
    return activeList ? activeList.name : "Tasks"
  }

  // Count active tasks
  const countActiveTasks = () => {
    return tasks.filter((task) => task.listId === activeListId && !task.completed).length
  }

  // Get active list color
  const getActiveListColor = () => {
    const activeList = lists.find((list) => list.id === activeListId)
    return activeList ? activeList.color : "#9764c7"
  }

  const activeListColor = getActiveListColor()

  return (
    <>
      <Draggable nodeRef={nodeRef} bounds="parent" defaultPosition={{ x: 20, y: 20 }}>
        <div
          ref={nodeRef}
          className="app-container w-[90vw] md:w-[350px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:absolute md:top-5 md:left-5 md:translate-y-0 z-[9999] bg-[rgba(46,26,71,0.8)] text-white rounded-2xl backdrop-blur-md border border-white/10 shadow-md p-4 cursor-move"
        >
          <header className="app-header flex justify-between items-center mb-6 cursor-move">
            <div className="header-left flex items-center cursor-pointer" onClick={() => setIsListsModalOpen(true)}>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                style={{ backgroundColor: activeListColor }}
              >
                <span className="text-xs">{getActiveListName().charAt(0)}</span>
              </div>
              <h1 className="app-title text-base md:text-lg font-medium mr-1 truncate max-w-[100px] md:max-w-[150px]">
                {getActiveListName()}
              </h1>
              <svg
                className="down-arrow w-4 h-4 stroke-gray-300 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <div className="filter-buttons flex gap-1 md:gap-2">
              <button
                className={`filter-btn bg-transparent border-none text-gray-300 cursor-pointer text-xs py-1 px-1 md:px-2 rounded-lg transition-all duration-200 hover:bg-white/10 ${currentFilter === "all" ? "active bg-purple-500 text-white" : ""}`}
                data-filter="all"
                onClick={() => onChangeFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-btn bg-transparent border-none text-gray-300 cursor-pointer text-xs py-1 px-1 md:px-2 rounded-lg transition-all duration-200 hover:bg-white/10 ${currentFilter === "active" ? "active bg-purple-500 text-white" : ""}`}
                data-filter="active"
                onClick={() => onChangeFilter("active")}
              >
                Active
              </button>
              <button
                className={`filter-btn bg-transparent border-none text-gray-300 cursor-pointer text-xs py-1 px-1 md:px-2 rounded-lg transition-all duration-200 hover:bg-white/10 ${currentFilter === "completed" ? "active bg-purple-500 text-white" : ""}`}
                data-filter="completed"
                onClick={() => onChangeFilter("completed")}
              >
                Completed
              </button>
            </div>
            <div className="close-btn text-base cursor-pointer flex-shrink-0" onClick={onClose}>
              ×
            </div>
          </header>

          <div
            className="todo-container border rounded-xl p-4 shadow-lg"
            style={{
              backgroundColor: `${activeListColor}10`,
              borderColor: `${activeListColor}30`,
            }}
          >
            <div className="add-task-container flex mb-6">
              <input
                type="text"
                id="new-task-input"
                placeholder="Add a new task..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addTask()
                  }
                }}
                className="flex-1 py-3 px-4 bg-white/10 border rounded-l-xl text-white text-sm focus:outline-none"
                style={{ borderColor: `${activeListColor}30` }}
              />
              <button
                id="add-task-btn"
                onClick={addTask}
                className="border-none rounded-r-xl text-white cursor-pointer px-4 transition-colors duration-200"
                style={{ backgroundColor: activeListColor }}
              >
                <svg
                  className="icon w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>

            <div className="tasks-list mb-6 max-h-[40vh] overflow-y-auto">
              {getFilteredTasks().length === 0 ? (
                <div className="empty-state text-center py-8 text-gray-300">
                  <p>No tasks found</p>
                  <p className="empty-description text-sm mt-2 opacity-70">Add a new task to get started</p>
                </div>
              ) : (
                getFilteredTasks().map((task) => {
                  // Get the task's list color
                  const taskList = lists.find((list) => list.id === task.listId) || lists[0]
                  const listColor = taskList.color
                  const isExpired = isDueDateExpired(task.dueDate, task.dueTime)

                  return (
                    <div
                      key={task.id}
                      className={`task-item flex flex-col py-3 border-b ${task.completed ? "completed" : ""}`}
                      style={{ borderColor: `${activeListColor}20` }}
                      data-id={task.id}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="task-checkbox appearance-none w-5 h-5 border-2 rounded-full mr-3 cursor-pointer relative flex-shrink-0 checked:bg-purple-500"
                          style={{
                            borderColor: activeListColor,
                            backgroundColor: task.completed ? activeListColor : "transparent",
                          }}
                          checked={task.completed}
                          onChange={() => onToggleTaskCompletion(task.id)}
                        />
                        <div className="task-content flex-1 min-w-0">
                          <div
                            className={`task-title text-sm whitespace-nowrap overflow-hidden text-ellipsis mb-1 ${task.completed ? "line-through text-gray-300" : ""}`}
                          >
                            {task.title}
                          </div>
                        </div>
                        <div className="task-actions ml-2">
                          <button
                            className="edit-task-btn bg-transparent border-none text-gray-300 cursor-pointer p-1 hover:text-purple-500"
                            onClick={() => {
                              setCurrentEditTask(task)
                              setIsEditTaskModalOpen(true)
                            }}
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
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {(task.dueDate || task.priority) && (
                        <div className="task-details flex items-center gap-3 text-xs text-gray-300 mt-1 ml-8">
                          {task.dueDate && (
                            <div className="task-due-date inline-flex items-center">
                              <div className="flex items-center mr-2">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDueDate(task.dueDate, task.dueTime)}
                              </div>

                              {isExpired && !task.completed && <TriangleAlert className="w-3 h-3 text-red-500" />}
                            </div>
                          )}

                          <div className="task-priority inline-flex items-center">
                            <span
                              className={`priority-indicator inline-block w-2 h-2 rounded-full mr-1 ${
                                task.priority === "high"
                                  ? "bg-red-500"
                                  : task.priority === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                              }`}
                            ></span>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            <div
              className="todo-footer flex justify-between items-center pt-4 text-xs"
              style={{ borderTop: `1px solid ${activeListColor}20` }}
            >
              <span id="tasks-counter" className="text-gray-300">
                {countActiveTasks()} item{countActiveTasks() !== 1 ? "s" : ""} left
              </span>
              <button
                id="clear-completed-btn"
                className="bg-transparent border-none text-gray-300 cursor-pointer text-xs hover:underline"
                style={{ color: activeListColor }}
                onClick={onClearCompletedTasks}
              >
                Clear completed
              </button>
            </div>
          </div>
        </div>
      </Draggable>

      {isListsModalOpen && (
        <ListsModal
          lists={lists}
          activeListId={activeListId}
          onClose={() => setIsListsModalOpen(false)}
          onChangeActiveList={onChangeActiveList}
          onAddList={onAddList}
          onDeleteList={onDeleteList}
        />
      )}

      {isEditTaskModalOpen && currentEditTask && (
        <EditTaskModal
          task={currentEditTask}
          onClose={() => setIsEditTaskModalOpen(false)}
          onSave={(updatedTask) => {
            // Update task in the tasks array
            const updatedTasks = tasks.map((task) => {
              if (task.id === updatedTask.id) {
                return updatedTask
              }
              return task
            })
            // Update tasks state
            // This would need to be implemented in the parent component
            setIsEditTaskModalOpen(false)
          }}
          onDelete={(taskId) => {
            // Delete task from the tasks array
            const updatedTasks = tasks.filter((task) => task.id !== taskId)
            // Update tasks state
            // This would need to be implemented in the parent component
            setIsEditTaskModalOpen(false)
          }}
        />
      )}
    </>
  )
}
