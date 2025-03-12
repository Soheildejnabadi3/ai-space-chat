export type Message = {
    role: "user" | "assistant" | "system"
    content: string
    timestamp: Date
  }
  
  export type Conversation = {
    id: string
    title: string
    messages: Message[]
    createdAt: Date
  }
  
  