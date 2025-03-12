"use client"
import { useSearchParams } from "next/navigation"
import ChatInterface from "@/components/chat/chat-interface"

export default function ChatPage() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get("initial")

  // We'll let the ChatInterface component handle the dark mode
  // instead of forcing it here

  return <ChatInterface initialPrompt={initialPrompt} />
}

