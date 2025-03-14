
/*
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4"),
    system:
      "You are Cosmic AI, a helpful assistant specializing in space, astronomy, and astrophysics. Provide accurate, engaging responses about celestial bodies, space exploration, cosmology, and related topics. Use analogies to explain complex concepts when appropriate.",
    messages,
    temperature: 0.7,
    max_tokens: 1000,
  })

  return result.toDataStreamResponse()
}
*/

