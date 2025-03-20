"use client";

import { ChatLayout } from "@/components/chat-layout";
import React from "react";
import { notFound, useParams } from "next/navigation";
import useChatStore from "@/app/hooks/useChatStore";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const getChatById = useChatStore((state) => state.getChatById);
  const chat = getChatById(id);

  if (!chat) {
    return notFound();
  }

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      <ChatLayout
        key={id}
        id={id}
        initialMessages={chat.messages}
        navCollapsedSize={10}
        defaultLayout={[30, 160]}
      />
    </main>
  );
}
