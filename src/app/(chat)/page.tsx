"use client";

import React from "react";

import { ChatLayout } from "@/components/chat/chat-layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UsernameForm from "@/components/username-form";
import { generateUUID } from "@/lib/utils";

import useChatStore from "../hooks/useChatStore";

export default function Home() {
  const id = generateUUID();
  const isInitialized = useChatStore((state) => state.isInitialized);

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center ">
      <ChatLayout
        key={id}
        id={id}
        initialMessages={[]}
        navCollapsedSize={10}
        defaultLayout={[30, 160]}
      />
      <Dialog open={!isInitialized}>
        <DialogContent className="flex flex-col space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>Welcome to Ollama!</DialogTitle>
            <DialogDescription>
              Enter your name to get started. This is just to personalize your experience.
            </DialogDescription>
            <UsernameForm />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
