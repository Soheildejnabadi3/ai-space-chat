"use client"

import type React from "react"

import { User, Sparkles, Copy, Check, AlertCircle, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Message } from "@/types/chat"
import { useState } from "react"

interface ChatMessagesProps {
  messages: Message[]
  isTyping: boolean
  copiedIndex: number | null
  onCopy: (text: string, index: number) => void
  messagesEndRef: React.RefObject<HTMLDivElement>
  errorMessage?: string | null
  containerRef?: React.RefObject<HTMLDivElement>
  onScroll?: () => void
}

export default function ChatMessages({
  messages,
  isTyping,
  copiedIndex,
  onCopy,
  messagesEndRef,
  errorMessage,
  containerRef,
  onScroll,
}: ChatMessagesProps) {
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Check if we should show the scroll to bottom button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShowScrollButton(!isNearBottom)

    if (onScroll) {
      onScroll()
    }
  }

  // Scroll to bottom when button is clicked
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div
      className="flex-1 overflow-y-auto pt-16 pb-20 bg-gray-50 dark:bg-black transition-colors duration-300 relative stars-bg"
      onScroll={handleScroll}
      ref={containerRef}
    >
      <div className="max-w-4xl mx-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "py-6 px-4 md:px-8 transition-all duration-300 animate-fadeIn",
              msg.role === "user" ? "bg-blue-50 dark:bg-gray-800/50" : "bg-white dark:bg-transparent",
            )}
          >
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start mb-2">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center mr-3 transition-transform duration-200 hover:scale-110",
                    msg.role === "user" ? "bg-blue-600" : "bg-purple-600 animate-pulse",
                  )}
                >
                  {msg.role === "user" ? <User size={16} /> : <Sparkles size={16} className="animate-spin-slow" />}
                </div>
                <div className="font-medium">{msg.role === "user" ? "You" : "Cosmic AI"}</div>

                {msg.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto h-8 w-8 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => onCopy(msg.content, index)}
                  >
                    {copiedIndex === index ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </Button>
                )}
              </div>

              <div className="pl-11 prose dark:prose-invert max-w-none transition-colors duration-300">
                <p>{msg.content}</p>
              </div>
            </div>
          </div>
        ))}

        {errorMessage && (
          <div className="py-6 px-4 md:px-8 animate-fadeIn bg-red-50 dark:bg-red-900/20">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start mb-2">
                <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center mr-3">
                  <AlertCircle size={16} className="text-white" />
                </div>
                <div className="font-medium text-red-600 dark:text-red-400">Error</div>
              </div>

              <div className="pl-11 text-red-600 dark:text-red-400">
                <p>{errorMessage}</p>
                <p className="text-sm mt-2">
                  Please check your OpenAI API key and make sure it's correctly set in your environment variables.
                </p>
              </div>
            </div>
          </div>
        )}

        {isTyping && (
          <div className="py-6 px-4 md:px-8 animate-fadeIn">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start mb-2">
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center mr-3 animate-pulse">
                  <Sparkles size={16} className="animate-spin-slow" />
                </div>
                <div className="font-medium">Cosmic AI</div>
              </div>

              <div className="pl-11">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 rounded-full h-10 w-10 bg-blue-600 hover:bg-blue-500 shadow-lg transition-all duration-200 hover:scale-105"
          aria-label="Scroll to bottom"
        >
          <ArrowDown size={20} />
        </Button>
      )}
    </div>
  )
}
