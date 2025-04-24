"use client"

import { useState } from "react"
import type { List } from "@/types"

interface ListsModalProps {
  lists: List[]
  activeListId: string
  onClose: () => void
  onChangeActiveList: (listId: string) => void
  onAddList: (list: List) => void
  onDeleteList: (listId: string) => void
}

export default function ListsModal({
  lists,
  activeListId,
  onClose,
  onChangeActiveList,
  onAddList,
  onDeleteList,
}: ListsModalProps) {
  const [newListName, setNewListName] = useState("")
  const [selectedColor, setSelectedColor] = useState("#9764c7")

  const colorOptions = [
    { color: "#9764c7", name: "Purple" },
    { color: "#4c9aff", name: "Blue" },
    { color: "#ff5630", name: "Red" },
    { color: "#36b37e", name: "Green" },
    { color: "#ffc400", name: "Yellow" },
  ]

  const handleAddList = () => {
    if (newListName.trim() !== "") {
      // Create new list object
      const list: List = {
        id: Date.now().toString(),
        name: newListName.trim(),
        color: selectedColor,
      }

      // Add to lists array
      onAddList(list)

      // Clear input
      setNewListName("")
    }
  }

  return (
    <div className="lists-modal fixed inset-0 z-[99999] flex items-center justify-center pointer-events-auto opacity-100">
      <div className="modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm z-[-1]" onClick={onClose}></div>
      <div className="modal-content relative w-[90%] max-w-[400px] max-h-[90vh] mx-auto bg-[rgba(36,36,56,0.95)] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-6 overflow-y-auto transform-none">
        <div className="modal-header flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-purple-500 text-xl md:text-2xl">My Lists</h2>
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
          <div className="lists-container mb-6 max-h-[250px] overflow-y-auto">
            {lists.map((list) => (
              <div
                key={list.id}
                className={`list-item flex items-center p-3 rounded-lg cursor-pointer mb-2 transition-colors duration-200 hover:bg-white/10 ${list.id === activeListId ? "active" : ""}`}
                style={{ backgroundColor: list.id === activeListId ? `${list.color}20` : "" }}
                data-id={list.id}
                onClick={() => {
                  onChangeActiveList(list.id)
                  onClose()
                }}
              >
                <div className="flex items-center">
                  <div className="list-color w-4 h-4 rounded-full mr-3" style={{ backgroundColor: list.color }}></div>
                <div className="list-name flex-1 text-sm">{list.name}</div>
                </div>
                <div className="list-options opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {list.id !== "default" && (
                    <button
                      className="list-option-btn bg-transparent border-none text-gray-300 cursor-pointer p-1 ml-1 hover:text-purple-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (
                          confirm("Are you sure you want to delete this list? All tasks in this list will be deleted.")
                        ) {
                          onDeleteList(list.id)
                        }
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3.5 h-3.5"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="add-list-container mt-4">
            <input
              type="text"
              id="new-list-input"
              placeholder="Add a new list..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full p-3 bg-white/10 border border-purple-500/20 rounded-lg text-white text-sm mb-3 focus:outline-none focus:border-purple-500"
            />
            <div className="color-picker flex justify-start gap-2 mb-3">
              {colorOptions.map((option) => (
                <span
                  key={option.color}
                  className={`color-option w-6 h-6 rounded-full cursor-pointer transition-transform duration-200 shadow-md hover:scale-110 ${selectedColor === option.color ? "selected border-2 border-white" : ""}`}
                  data-color={option.color}
                  style={{ backgroundColor: option.color }}
                  onClick={() => setSelectedColor(option.color)}
                  title={option.name}
                ></span>
              ))}
            </div>
            <button
              id="add-list-btn"
              className="add-btn w-full p-3 bg-purple-500 text-white border-none rounded-lg font-medium cursor-pointer transition-colors duration-200 hover:bg-purple-600"
              onClick={handleAddList}
            >
              Add List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
