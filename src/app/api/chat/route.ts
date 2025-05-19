import { google } from "@ai-sdk/google";
import { streamText, convertToCoreMessages, UserContent } from "ai";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Destructure request data
    const { messages, selectedModel, data, system } = await req.json();

    const model = google(selectedModel);

    const initialMessages = messages.slice(0, -1);
    const currentMessage = messages[messages.length - 1];

    // Build message content array directly
    const messageContent: UserContent = [{ type: "text", text: currentMessage.content }];

    // Add images if they exist and if using vision model
    if (data?.images?.length && selectedModel === "gemini-pro-vision") {
      data.images.forEach((imageUrl: string) => {
        const image = new URL(imageUrl);
        messageContent.push({ type: "image", image });
      });
    }

    // Stream text using the Google AI model
    const result = streamText({
      model,
      system: system ?? "You are a helpful assistant.",
      messages: [
        ...convertToCoreMessages(initialMessages),
        { role: "user", content: messageContent },
      ],
    });

    return result.toDataStreamResponse({
      getErrorMessage(error) {
        console.error("Error in streaming:", error);
        return "An error occurred while processing your request.";
      },
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
