"use client"

import { useState } from "react"
import type { Settings } from "@/types"

interface SettingsPanelProps {
  settings: Settings
  onClose: () => void
  onSave: (settings: Settings) => void
}

export default function SettingsPanel({ settings, onClose, onSave }: SettingsPanelProps) {
  const [pomodoroLength, setPomodoroLength] = useState(settings.pomodoro)
  const [shortBreakLength, setShortBreakLength] = useState(settings.shortBreak)
  const [longBreakLength, setLongBreakLength] = useState(settings.longBreak)
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled)
  const [soundTheme, setSoundTheme] = useState(settings.soundTheme)

  const handleSave = () => {
    onSave({
      pomodoro: pomodoroLength,
      shortBreak: shortBreakLength,
      longBreak: longBreakLength,
      soundEnabled,
      soundTheme,
    })
  }

  return (
    <div className="settings-panel fixed inset-0 z-[99999999] flex items-center justify-center opacity-100 pointer-events-auto">
      <div className="settings-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="settings-content relative max-w-[90%] w-[400px] bg-[#1a1a2e] rounded-xl shadow-lg p-4 md:p-6 transform-none opacity-100 max-h-[90vh] overflow-y-auto">
        <div className="settings-header flex justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl m-0">Settings</h2>
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

        <div className="settings-section mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-300 border-b border-white/10 pb-2">Timer Duration</h3>

          <div className="setting-item mb-4 flex justify-between items-center">
            <label htmlFor="pomodoro-length" className="text-sm text-white mr-4">
              Pomodoro
            </label>
            <div className="input-with-unit flex items-center">
              <input
                type="number"
                id="pomodoro-length"
                value={pomodoroLength}
                onChange={(e) => setPomodoroLength(Number.parseInt(e.target.value))}
                min="1"
                max="60"
                className="w-[50px] bg-white/10 border border-white/20 rounded p-1 text-white text-center"
              />
              <span className="unit text-xs text-gray-300 ml-1">min</span>
            </div>
          </div>

          <div className="setting-item mb-4 flex justify-between items-center">
            <label htmlFor="short-break-length" className="text-sm text-white mr-4">
              Short Break
            </label>
            <div className="input-with-unit flex items-center">
              <input
                type="number"
                id="short-break-length"
                value={shortBreakLength}
                onChange={(e) => setShortBreakLength(Number.parseInt(e.target.value))}
                min="1"
                max="30"
                className="w-[50px] bg-white/10 border border-white/20 rounded p-1 text-white text-center"
              />
              <span className="unit text-xs text-gray-300 ml-1">min</span>
            </div>
          </div>

          <div className="setting-item mb-4 flex justify-between items-center">
            <label htmlFor="long-break-length" className="text-sm text-white mr-4">
              Long Break
            </label>
            <div className="input-with-unit flex items-center">
              <input
                type="number"
                id="long-break-length"
                value={longBreakLength}
                onChange={(e) => setLongBreakLength(Number.parseInt(e.target.value))}
                min="1"
                max="60"
                className="w-[50px] bg-white/10 border border-white/20 rounded p-1 text-white text-center"
              />
              <span className="unit text-xs text-gray-300 ml-1">min</span>
            </div>
          </div>
        </div>

        <div className="settings-section mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-300 border-b border-white/10 pb-2">Sound</h3>

          <div className="setting-item toggle mb-5 flex justify-between items-center">
            <label htmlFor="sound-toggle" className="text-sm text-white mr-4">
              Timer End Sound
            </label>
            <label className="switch relative inline-block w-12 h-6">
              <input
                type="checkbox"
                id="sound-toggle"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="opacity-0 w-0 h-0"
              />
              <span className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-white/10 transition-[0.4s] rounded-[34px] before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition-[0.4s] before:rounded-[50%]"></span>
            </label>
          </div>

          <div className="setting-item flex justify-between items-center">
            <label htmlFor="sound-theme" className="text-sm text-white mr-4">
              Sound Theme
            </label>
            <select
              id="sound-theme"
              value={soundTheme}
              onChange={(e) => setSoundTheme(e.target.value)}
              className="bg-white/10 border border-white/20 rounded p-1 text-white min-w-[120px]"
            >
              <option value="minimal">Minimal</option>
              <option value="digital">Digital</option>
              <option value="nature">Nature</option>
            </select>
          </div>
        </div>

        <button
          className="save-btn bg-purple-500 text-white border-none rounded p-3 w-full font-medium mt-4 cursor-pointer transition-colors duration-200 hover:bg-purple-600"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
