"use client"

import { useState, useRef } from "react"
import Draggable from "react-draggable"
import type { Task, List } from "@/types"
import ListsModal from "./lists-modal"
import EditTaskModal from "./edit-task-modal"

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

  // Get active list name
  const getActiveListName = () => {
    const activeList = lists.find((list) => list.id === activeListId)
    return activeList ? activeList.name : "Tasks"
  }

  // Count active tasks
  const countActiveTasks = () => {
    return tasks.filter((task) => task.listId === activeListId && !task.completed).length
  }

  return (
    <>
      <Draggable nodeRef={nodeRef} bounds="parent" handle=".app-header">
        <div
          ref={nodeRef}
          className="app-container w-[350px] absolute top-5 left-5 z-[1001] bg-[rgba(46,26,71,0.8)] text-white rounded-2xl backdrop-blur-md border border-white/10 shadow-md p-4"
        >
          <header className="app-header flex justify-between items-center mb-6 cursor-move">
            <div className="header-left flex items-center cursor-pointer" onClick={() => setIsListsModalOpen(true)}>
              <h1 className="app-title text-lg font-medium mr-1">{getActiveListName()}</h1>
              <svg
                className="down-arrow w-4 h-4 stroke-gray-300"
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
            <div className="filter-buttons flex gap-2">
              <button
                className={`filter-btn bg-transparent border-none text-gray-300 cursor-pointer text-xs py-1 px-2 rounded transition-all duration-200 hover:bg-white/10 ${currentFilter === "all" ? "active bg-purple-500 text-white" : ""}`}
                data-filter="all"
                onClick={() => onChangeFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-btn bg-transparent border-none text-gray-300 cursor-pointer text-xs py-1 px-2 rounded transition-all duration-200 hover:bg-white/10 ${currentFilter === "active" ? "active bg-purple-500 text-white" : ""}`}
                data-filter="active"
                onClick={() => onChangeFilter("active")}
              >
                Active
              </button>
              <button
                className={`filter-btn bg-transparent border-none text-gray-300 cursor-pointer text-xs py-1 px-2 rounded transition-all duration-200 hover:bg-white/10 ${currentFilter === "completed" ? "active bg-purple-500 text-white" : ""}`}
                data-filter="completed"
                onClick={() => onChangeFilter("completed")}
              >
                Completed
              </button>
            </div>
            <div className="close-btn text-base cursor-pointer" onClick={onClose}>
              ×
            </div>
          </header>

          <div className="todo-container bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 shadow-lg">
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
                className="flex-1 py-3 px-4 bg-white/10 border border-purple-500/20 rounded-l-xl text-white text-sm focus:outline-none focus:border-purple-500"
              />
              <button
                id="add-task-btn"
                onClick={addTask}
                className="bg-purple-500 border-none rounded-r-xl text-white cursor-pointer px-4 transition-colors duration-200 hover:bg-purple-600"
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

            <div className="tasks-list mb-6 max-h-[400px] overflow-y-auto">
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

                  return (
                    <div
                      key={task.id}
                      className={`task-item flex items-center py-3 border-b border-purple-500/20 ${task.completed ? "completed" : ""}`}
                      data-id={task.id}
                    >
                      <input
                        type="checkbox"
                        className="task-checkbox appearance-none w-5 h-5 border-2 border-purple-500 rounded-full mr-3 cursor-pointer relative flex-shrink-0 checked:bg-purple-500"
                        checked={task.completed}
                        onChange={() => onToggleTaskCompletion(task.id)}
                      />
                      <div className="task-content flex-1 min-w-0">
                        <div
                          className={`task-title text-sm whitespace-nowrap overflow-hidden text-ellipsis mb-1 ${task.completed ? "line-through text-gray-300" : ""}`}
                        >
                          {task.title}
                        </div>
                        {task.dueDate && (
                          <div className="task-details flex items-center gap-3 text-xs text-gray-300">
                            <div className="task-due-date inline-flex items-center">
                              <svg
                                className="icon w-3 h-3 mr-1"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              {formatDueDate(task.dueDate, task.dueTime)}
                            </div>
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
                  )
                })
              )}
            </div>

            <div className="todo-footer flex justify-between items-center pt-4 border-t border-purple-500/20 text-xs">
              <span id="tasks-counter" className="text-gray-300">
                {countActiveTasks()} item{countActiveTasks() !== 1 ? "s" : ""} left
              </span>
              <button
                id="clear-completed-btn"
                className="bg-transparent border-none text-gray-300 cursor-pointer text-xs hover:text-purple-500 hover:underline"
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
