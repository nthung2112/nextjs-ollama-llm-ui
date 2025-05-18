import { google } from "@ai-sdk/google";
import { streamText, convertToCoreMessages, UserContent } from "ai";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
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
    model: model,
    system: system ?? "You are a helpful assistant.",
    messages: [
      ...convertToCoreMessages(initialMessages),
      { role: "user", content: messageContent },
    ],
  });

  return result.toDataStreamResponse();
}
