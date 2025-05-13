"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import ChatSidebar from "./chat-sidebar"
import ChatHeader from "./chat-header"
import ChatMessages from "./chat-messages"
import type { Conversation } from "@/types/chat"
import { useChat } from "ai/react"

interface ChatInterfaceProps {
  initialPrompt?: string | null
}

export default function ChatInterface({ initialPrompt }: ChatInterfaceProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "New Conversation",
      messages: [
        {
          role: "system",
          content: "You are Cosmic AI, a specialized assistant focused on astronomy, astrophysics, cosmology, space exploration, and all cosmic phenomena.",
          timestamp: new Date(),
        },
        {
          role: "assistant",
          content: "Hello! I'm Cosmic AI, your guide to the universe. How can I help you explore space and astronomy today?",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    },
  ])
  const [activeConversation, setActiveConversation] = useState<string>("1")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { toast } = useToast()
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const prevMessagesLengthRef = useRef(0)
  const prevAiMessagesLengthRef = useRef(0)

  // Use the AI SDK's useChat hook for handling chat interactions
  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    error,
    setMessages,
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm Cosmic AI, your guide to the universe. How can I help you explore space and astronomy today?",
      },
    ],
    initialInput: initialPrompt || "",
    onError: (error) => {
      console.error("Chat error details:", error)
      setErrorMessage(error.message || "An error occurred while processing your request.")
    },
  })

  // Custom submit handler with error handling
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    setShouldAutoScroll(true) // Enable auto-scroll when user sends a message

    try {
      await originalHandleSubmit(e)
    } catch (err) {
      console.error("Error in handleSubmit:", err)
      const errorMsg = err instanceof Error ? err.message : "An error occurred while sending your message."
      setErrorMessage(errorMsg)
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
    }
  }

  // Update conversation title based on first user message
  const updateConversationTitle = useCallback((conversationId: string, userMessage: string) => {
    // Update the title based on the first user message
    const title = userMessage.length > 30 ? userMessage.substring(0, 30) + "..." : userMessage

    setConversations((prevConversations) =>
      prevConversations.map((conv) => (conv.id === conversationId ? { ...conv, title } : conv)),
    )
  }, [])

  // Update local state when AI messages change
  useEffect(() => {
    // Skip if no messages
    if (aiMessages.length === 0) {
      return
    }

    // Create formatted messages from AI messages
    const formattedMessages = aiMessages.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
      timestamp: new Date(),
    }))

    // Update the active conversation with the new messages
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: [
                // Keep the system message
                conv.messages.find((msg) => msg.role === "system") || {
                  role: "system",
                  content: "You are Cosmic AI, a specialized assistant focused on astronomy, astrophysics, cosmology, space exploration, and all cosmic phenomena.",
                  timestamp: new Date(),
                },
                ...formattedMessages,
              ],
            }
          : conv,
      ),
    )

    // Update conversation title if it's the first user message
    if (aiMessages.length >= 2 && aiMessages[1].role === "user") {
      updateConversationTitle(activeConversation, aiMessages[1].content)
    }

    // Update the previous message length reference
    prevAiMessagesLengthRef.current = aiMessages.length
  }, [aiMessages, activeConversation, updateConversationTitle])

  // Handle initial prompt
  useEffect(() => {
    if (initialPrompt && aiMessages.length === 1) {
      // Trigger submission with initial prompt
      const formEvent = new Event("submit") as any
      handleSubmit(formEvent)
    }
  }, [initialPrompt, aiMessages.length])

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Math.random().toString(36).substring(7),
      title: "New Conversation",
      messages: [
        {
          role: "system",
          content: "You are Cosmic AI, a specialized assistant focused on astronomy, astrophysics, cosmology, space exploration, and all cosmic phenomena.",
          timestamp: new Date(),
        },
        {
          role: "assistant",
          content: "Hello! I'm Cosmic AI, your guide to the universe. How can I help you explore space and astronomy today?",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    }

    setConversations((prev) => [...prev, newConversation])
    setActiveConversation(newConversation.id)
    setSidebarOpen(false)
    setShouldAutoScroll(true) // Enable auto-scroll for new conversation

    // Reset AI messages for the new conversation
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm Cosmic AI, your guide to the universe. How can I help you explore space and astronomy today?",
      },
    ])
  }

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the conversation selection
    setConversations((prev) => prev.filter((conversation) => conversation.id !== id))
    if (activeConversation === id) {
      setActiveConversation((prev) => {
        const remaining = conversations.filter((c) => c.id !== id)
        return remaining.length > 0 ? remaining[0].id : ""
      })
    }
  }

  const handleAuth = (type: "signin" | "signup") => {
    alert(`${type === "signin" ? "Sign In" : "Sign Up"} functionality would go here.`)
  }

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newDarkMode = !prev
      if (newDarkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      return newDarkMode
    })
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

  // Handle scrolling behavior
  const scrollToBottom = useCallback(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [shouldAutoScroll])

  // Detect when user scrolls manually
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50 // Within 50px of bottom

    // Only change auto-scroll if we're not at the bottom and it's currently enabled
    if (!isAtBottom && shouldAutoScroll) {
      setShouldAutoScroll(false)
    } else if (isAtBottom && !shouldAutoScroll) {
      setShouldAutoScroll(true)
    }
  }, [shouldAutoScroll])

  // Get current conversation
  const getCurrentConversation = useCallback(() => {
    return conversations.find((conversation) => conversation.id === activeConversation)
  }, [conversations, activeConversation])

  // Scroll to bottom when messages change, but respect user's scroll position
  useEffect(() => {
    const currentConversation = getCurrentConversation()
    if (!currentConversation) return

    const currentMessages = currentConversation.messages.filter((msg) => msg.role !== "system") || []

    // Check if new messages have been added
    if (currentMessages.length > prevMessagesLengthRef.current) {
      scrollToBottom()
    }

    prevMessagesLengthRef.current = currentMessages.length
  }, [conversations, getCurrentConversation, scrollToBottom])

  // Scroll to bottom when loading state changes
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom()
    }
  }, [isLoading, scrollToBottom])

  // Initialize dark mode and handle resize
  useEffect(() => {
    // Check if dark mode is already set
    const isDark = document.documentElement.classList.contains("dark")
    setIsDarkMode(isDark)

    // Handle resize for mobile view
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      if (isMobileView) {
        setSidebarOpen(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Show error toast if API request fails
  useEffect(() => {
    if (error) {
      console.error("Chat error:", error)
      const errorMsg = error instanceof Error ? error.message : "An error occurred while processing your request."
      setErrorMessage(errorMsg)
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
        duration: 5000,
      })
    }
  }, [error, toast])

  const currentConversation = getCurrentConversation()

  return (
    <div className={cn("min-h-screen flex flex-col transition-colors duration-300", isDarkMode ? "dark" : "")}>
      <div className="flex flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-white transition-colors duration-300">
        <ChatSidebar
          open={sidebarOpen}
          conversations={conversations}
          activeConversation={activeConversation}
          onCreateConversation={createNewConversation}
          onSelectConversation={(id) => setActiveConversation(id)}
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
            isTyping={isLoading}
            copiedIndex={copiedIndex}
            onCopy={copyToClipboard}
            messagesEndRef={messagesEndRef}
            errorMessage={errorMessage}
            containerRef={messagesContainerRef}
            onScroll={handleScroll}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 transition-colors duration-300">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="flex items-center">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything cosmic..."
                  className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-blue-500 rounded-r-none transition-colors duration-300"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-500 rounded-l-none transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  <Send size={18} className="mr-2 transition-transform duration-200 group-hover:translate-x-1" /> Send
                </Button>
              </div>
              {errorMessage && (
                <div className="text-sm text-center mt-2 text-red-500 dark:text-red-400 transition-colors duration-300">
                  Error: {errorMessage}
                </div>
              )}
              <div className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Cosmic AI provides information about space and astronomy. Verify important information.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
