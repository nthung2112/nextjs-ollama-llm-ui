import { Message } from "ai/react";
import React from "react";
import ChatMessage from "./chat-message";
import { ChatMessageList } from "../ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble";
import { ChatRequestOptions } from "ai";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useChatStore from "@/app/hooks/useChatStore";

interface ChatListProps {
  role: string;
  messages: Message[];
  isLoading: boolean;
  loadingSubmit?: boolean;
  reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
}

function PromptEditModal({ role }: { role: string }) {
  const systemPrompt = useChatStore((state) => state.systemPrompt);
  const updateSystemPrompt = useChatStore((state) => state.updateSystemPrompt);
  const prompt = systemPrompt[role] ?? systemPrompt.default;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(prompt);

  return (
    <>
      <div
        className="border rounded-lg p-2 max-h-14 overflow-hidden line-clamp-2 text-sm cursor-pointer border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
        onClick={() => setOpen(true)}
        title={prompt}
      >
        {prompt}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
          </DialogHeader>
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-2"
            autoFocus
            placeholder="Type your prompt here..."
            rows={10}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => updateSystemPrompt(role, value)}
              >
                Save Changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function ChatList({
  role,
  messages,
  isLoading,
  loadingSubmit,
  reload,
}: ChatListProps) {
  return (
    <div className="flex-1 w-full overflow-y-auto mx-auto max-w-3xl">
      <ChatMessageList>
        <PromptEditModal role={role} />
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id || index}
            message={message}
            isLast={index === messages.length - 1}
            isLoading={isLoading}
            reload={reload}
          />
        ))}
        {loadingSubmit && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar
              src="/ollama.png"
              width={6}
              height={6}
              className="object-contain dark:invert"
            />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        )}
      </ChatMessageList>
    </div>
  );
}
