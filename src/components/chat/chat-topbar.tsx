"use client";

import React, { useEffect } from "react";
import { CaretSortIcon, PlusIcon } from "@radix-ui/react-icons";
import { Message } from "ai/react";

import useChatStore from "@/app/hooks/useChatStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Button } from "../ui/button";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ChatTopbarProps {
  isLoading: boolean;
  chatId?: string;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export default function ChatTopbar({ isLoading, chatId, messages, setMessages }: ChatTopbarProps) {
  const models = [
    "gemini-2.0-flash-001",
    "gemini-1.5-pro-latest",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-8b-latest",
  ];
  const [open, setOpen] = React.useState(false);
  const selectedModel = useChatStore((state) => state.selectedModel);
  const setSelectedModel = useChatStore((state) => state.setSelectedModel);
  const router = useRouter();
  const { open: sidebarOpen, isMobile } = useSidebar();

  useEffect(() => {
    // Set default model if none selected
    if (!selectedModel) {
      setSelectedModel("gemini-2.0-flash-001");
    }
  }, [selectedModel, setSelectedModel]);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setOpen(false);
  };

  return (
    <div className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarTrigger />
      {(!sidebarOpen || isMobile) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="md:px-2 px-2 md:h-fit ml-auto md:ml-0"
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="gap-2">
              {selectedModel || "Select a model"}
              <CaretSortIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-2" align="start">
            <div className="flex flex-col gap-2">
              {models.map((model) => (
                <Button
                  key={model}
                  variant={selectedModel === model ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => handleModelChange(model)}
                >
                  {model}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
