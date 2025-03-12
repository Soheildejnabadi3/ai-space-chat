"use client"

import type React from "react"

import { MessageSquare, Plus, User, Trash, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Conversation } from "@/types/chat"

interface ChatSidebarProps {
  open: boolean
  conversations: Conversation[]
  activeConversation: string
  onCreateConversation: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string, e: React.MouseEvent) => void
  onAuth: (type: "signin" | "signup") => void
}

export default function ChatSidebar({
  open,
  conversations,
  activeConversation,
  onCreateConversation,
  onSelectConversation,
  onDeleteConversation,
  onAuth,
}: ChatSidebarProps) {
  return (
    <div
      className={cn(
        "fixed md:relative z-20 h-full transition-all duration-300 ease-in-out",
        "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-r border-gray-200 dark:border-gray-800",
        open ? "w-64" : "w-0 md:w-16",
        "flex flex-col",
      )}
    >
      <div className="flex-1 overflow-hidden flex flex-col">
        {open && (
          <>
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                  <Sparkles size={18} className="text-white animate-spin-slow" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Cosmic AI
                </h1>
              </div>

              <Button
                onClick={onCreateConversation}
                className="w-full mb-4 bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 hover:scale-105"
              >
                <Plus className="mr-2 h-4 w-4" /> New Chat
              </Button>
            </div>

            <div className="px-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">CONVERSATIONS</div>

            <div className="flex-1 overflow-y-auto px-2 space-y-1 mb-4">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 cursor-pointer group transition-all duration-200",
                    activeConversation === conv.id
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50",
                  )}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <MessageSquare size={16} className="transition-transform duration-200 group-hover:scale-110" />
                    <span className="truncate">{conv.title}</span>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 transition-opacity duration-200"
                    onClick={(e) => onDeleteConversation(conv.id, e)}
                  >
                    <Trash
                      size={14}
                      className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                    />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div
        className={cn(
          "p-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300",
          !open && "flex justify-center",
        )}
      >
        {open ? (
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 transition-colors duration-200"
              onClick={() => onAuth("signin")}
            >
              Sign In
            </Button>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-500 transition-all duration-200 hover:scale-105"
              onClick={() => onAuth("signup")}
            >
              Sign Up
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAuth("signin")}
            className="transition-transform duration-200 hover:scale-110"
          >
            <User size={20} />
          </Button>
        )}
      </div>
    </div>
  )
}

