"use client"

import { ChevronLeft, ChevronRight, Settings, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatHeaderProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  title: string
}

export default function ChatHeader({
  sidebarOpen,
  onToggleSidebar,
  isDarkMode,
  onToggleDarkMode,
  title,
}: ChatHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="mr-2 transition-transform duration-200 hover:scale-110"
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <h2 className="text-lg font-medium truncate">{title}</h2>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            className="transition-all duration-500 hover:rotate-90"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-400 animate-pulse" />
            ) : (
              <Moon size={20} className="text-blue-500" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="transition-transform duration-200 hover:scale-110">
            <Settings size={20} />
          </Button>
        </div>
      </div>
    </header>
  )
}

