"use client"

import type React from "react"

import { useState } from "react"
import type { Task } from "@/types"

interface EditTaskModalProps {
  task: Task
  onClose: () => void
  onSave: (task: Task) => void
  onDelete: (taskId: number) => void
}

export default function EditTaskModal({ task, onClose, onSave, onDelete }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [dueDate, setDueDate] = useState(task.dueDate)
  const [dueTime, setDueTime] = useState(task.dueTime)
  const [priority, setPriority] = useState(task.priority)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create updated task object
    const updatedTask: Task = {
      ...task,
      title,
      description,
      dueDate,
      dueTime,
      priority,
    }

    // Save task
    onSave(updatedTask)
  }

  return (
    <div className="edit-task-modal fixed inset-0 z-[99999] flex items-center justify-center pointer-events-auto opacity-100">
      <div className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm z-[-1]" onClick={onClose}></div>
      <div className="modal-content relative w-[90%] max-w-[400px] max-h-[90vh] mx-auto bg-[rgba(36,36,56,0.95)] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 overflow-y-auto transform-none">
        <div className="modal-header flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-purple-500 text-xl md:text-2xl">Edit Task</h2>
          <button className="close-btn bg-transparent border-none text-white cursor-pointer" onClick={onClose}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <form id="edit-task-form" onSubmit={handleSubmit}>
            <div className="form-group mb-5">
              <label htmlFor="edit-task-title" className="block mb-2 text-sm">
                Task Title
              </label>
              <input
                type="text"
                id="edit-task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-3 bg-white/10 border border-purple-500/20 rounded-md text-white text-sm"
              />
            </div>

            <div className="form-group mb-5">
              <label htmlFor="edit-task-description" className="block mb-2 text-sm">
                Description (optional)
              </label>
              <textarea
                id="edit-task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-white/10 border border-purple-500/20 rounded-md text-white text-sm h-[100px] resize-vertical"
              ></textarea>
            </div>

            <div className="form-group mb-5">
              <label htmlFor="edit-task-due-date" className="block mb-2 text-sm">
                Due Date (optional)
              </label>
              <input
                type="date"
                id="edit-task-due-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-3 bg-white/10 border border-purple-500/20 rounded-md text-white text-sm"
              />
            </div>

            <div className="form-group mb-5">
              <label htmlFor="edit-task-due-time" className="block mb-2 text-sm">
                Time (optional)
              </label>
              <input
                type="time"
                id="edit-task-due-time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full p-3 bg-white/10 border border-purple-500/20 rounded-md text-white text-sm"
              />
            </div>

            <div className="form-group mb-5">
              <label htmlFor="edit-task-priority" className="block mb-2 text-sm">
                Priority
              </label>
              <select
                id="edit-task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 bg-white/10 border border-purple-500/20 rounded-md text-white text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-actions flex justify-between mt-6">
              <button
                type="button"
                id="delete-task-btn"
                className="delete-btn py-3 px-6 bg-red-500/20 text-red-500 border border-red-500/30 rounded-md cursor-pointer hover:bg-red-500/30"
                onClick={() => onDelete(task.id)}
              >
                Delete
              </button>
              <button
                type="submit"
                className="save-btn py-3 px-6 bg-purple-500 text-white border-none rounded-md cursor-pointer hover:bg-purple-600"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
