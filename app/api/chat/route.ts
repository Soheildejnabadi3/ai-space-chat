import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Extract the messages from the request
    const { messages } = await req.json()

    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key is missing. Please add it to your environment variables.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    // Initialize the OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    })

    // Create the completion
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using a more widely available model
      messages: [
        {
          role: "system",
          content: 
            "You are Cosmic AI, a specialized assistant focused on astronomy, astrophysics, cosmology, space exploration, and all cosmic phenomena. Provide accurate, engaging responses about celestial bodies, space missions, astronomical discoveries, and cosmic theories. Use analogies to explain complex space concepts when appropriate, and convey enthusiasm for the wonders of the universe.",
        },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    })

    // Convert the response to a readable stream
    const stream = OpenAIStream(response as any)

    // Return the stream as a streaming response
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error in chat API route:", error)

    // Return a more detailed error response
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request.",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
