export interface ChannelInfo {
  id: string
  title: string
  icon: string
}

export interface Settings {
  pomodoro: number
  shortBreak: number
  longBreak: number
  soundEnabled: boolean
  soundTheme: string
}

export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  dueDate: string
  dueTime: string
  priority: string
  listId: string
}

export interface List {
  id: string
  name: string
  color: string
}
