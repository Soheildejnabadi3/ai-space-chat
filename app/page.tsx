"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Add a function to handle theme preference when navigating to chat
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)

    // Store the current theme preference in localStorage before navigating
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    localStorage.setItem("theme", prefersDark ? "dark" : "light")

    // Simulate a brief loading state before redirecting
    setTimeout(() => {
      router.push(`/chat?initial=${encodeURIComponent(prompt)}`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                  <Sparkles size={18} className="text-white animate-spin-slow" />
                </div>
              </div>
              <div className="ml-4 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Cosmic AI
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-300 hover:text-white transition-colors">
                Sign in
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-500 transition-all duration-200 hover:scale-105">
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-16 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          {/* Logo animation */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse blur-xl opacity-50" />
            <div className="relative w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              <Sparkles size={48} className="text-blue-400 animate-spin-slow" />
            </div>
          </div>

          {/* Hero text */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Explore the cosmos with AI.</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your personal AI assistant for discovering the wonders of space and astronomy. Ask anything about the
            universe and beyond.
          </p>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full">
            <div className="relative">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask about black holes, galaxies, or anything cosmic..."
                className="w-full bg-gray-800/50 border-gray-700 focus:border-blue-500 rounded-lg pl-4 pr-12 py-6 text-lg placeholder:text-gray-500"
              />
              <Button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2",
                  "bg-blue-600 hover:bg-blue-500 transition-all duration-200",
                  "hover:scale-105 disabled:hover:scale-100",
                  isLoading && "animate-pulse",
                )}
              >
                <Send size={20} />
              </Button>
            </div>
          </form>

          {/* Quick prompts */}
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Button
              variant="outline"
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700 transition-all duration-200"
              onClick={() => setPrompt("Tell me about black holes")}
            >
              Black holes
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700 transition-all duration-200"
              onClick={() => setPrompt("Explain dark matter")}
            >
              Dark matter
            </Button>
            <Button
              variant="outline"
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700 transition-all duration-200"
              onClick={() => setPrompt("Latest space discoveries")}
            >
              Latest discoveries
            </Button>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-800 pt-8 mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">100K+</div>
                <div className="text-gray-500">Questions Answered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">99%</div>
                <div className="text-gray-500">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">24/7</div>
                <div className="text-gray-500">Availability</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

