"use client"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import ChatSidebar from "./chat-sidebar"
import ChatHeader from "./chat-header"
import ChatMessages from "./chat-messages"
import type { Message, Conversation } from "@/types/chat"

interface ChatInterfaceProps {
  initialPrompt?: string | null
}

export default function ChatInterface({ initialPrompt }: ChatInterfaceProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [message, setMessage] = useState(initialPrompt || "")
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "New Conversation",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant with knowledge about space and astronomy.",
          timestamp: new Date(),
        },
        {
          role: "assistant",
          content: "Hello! I'm your AI assistant. How can I help you explore the cosmos today?",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    },
  ])
  const [activeConversation, setActiveConversation] = useState<string>("1")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { toast } = useToast()
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(new Event("submit") as any)
    }
  }, [])

  const handleSendMessage = async (e: any) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsTyping(true)

    const newMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    const updatedConversations = conversations.map((conversation) =>
      conversation.id === activeConversation
        ? { ...conversation, messages: [...conversation.messages, newMessage] }
        : conversation,
    )

    setConversations(updatedConversations)
    setMessage("")

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: "This is a simulated AI response to: " + message,
        timestamp: new Date(),
      }

      const updatedConversationsWithResponse = updatedConversations.map((conversation) =>
        conversation.id === activeConversation
          ? { ...conversation, messages: [...conversation.messages, aiResponse] }
          : conversation,
      )

      setConversations(updatedConversationsWithResponse)
      setIsTyping(false)
      scrollToBottom()
    }, 1500)
  }

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Math.random().toString(36).substring(7),
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
    }

    setConversations([...conversations, newConversation])
    setActiveConversation(newConversation.id)
    setSidebarOpen(false)
  }

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter((conversation) => conversation.id !== id))
    if (activeConversation === id) {
      setActiveConversation(conversations[0]?.id || "")
    }
  }

  const handleAuth = () => {
    alert("Authentication logic goes here.")
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    toast({
      title: "Copied to clipboard!",
      duration: 2000,
    })
    setTimeout(() => {
      setCopiedIndex(null)
    }, 2000)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversations, activeConversation])

  useEffect(() => {
    // Check if dark mode is already set
    const isDark = document.documentElement.classList.contains("dark")
    setIsDarkMode(isDark)

    // Rest of the code for mobile check...
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const currentConversation = conversations.find((conversation) => conversation.id === activeConversation)

  return (
    <div className={cn("min-h-screen flex flex-col transition-colors duration-300", isDarkMode ? "dark" : "")}>
      <div className="flex flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-white transition-colors duration-300">
        <ChatSidebar
          open={sidebarOpen}
          conversations={conversations}
          activeConversation={activeConversation}
          onCreateConversation={createNewConversation}
          onSelectConversation={setActiveConversation}
          onDeleteConversation={deleteConversation}
          onAuth={handleAuth}
        />

        <div className="flex-1 flex flex-col overflow-hidden relative">
          <ChatHeader
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            title={currentConversation?.title || "New Conversation"}
          />

          <ChatMessages
            messages={currentConversation?.messages.filter((msg) => msg.role !== "system") || []}
            isTyping={isTyping}
            copiedIndex={copiedIndex}
            onCopy={copyToClipboard}
            messagesEndRef={messagesEndRef}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 transition-colors duration-300">
            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
              <div className="flex items-center">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message Cosmic AI..."
                  className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-blue-500 rounded-r-none transition-colors duration-300"
                />
                <Button
                  type="submit"
                  disabled={!message.trim()}
                  className="bg-blue-600 hover:bg-blue-500 rounded-l-none transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  <Send size={18} className="mr-2 transition-transform duration-200 group-hover:translate-x-1" /> Send
                </Button>
              </div>
              <div className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Cosmic AI can make mistakes. Consider checking important information.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

