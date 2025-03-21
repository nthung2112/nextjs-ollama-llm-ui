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
  const [models, setModels] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const selectedModel = useChatStore((state) => state.selectedModel);
  const setSelectedModel = useChatStore((state) => state.setSelectedModel);
  const router = useRouter();
  const { open: sidebarOpen, isMobile } = useSidebar();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/tags");
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const data = await res.json().catch(() => null);
        if (!data?.models?.length) return;

        setModels(data.models.map(({ name }: { name: string }) => name));
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    })();
  }, []);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setOpen(false);
  };

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarTrigger className="p-4" />

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

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={isLoading}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {selectedModel || "Select model"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-1">
          {models.length > 0 ? (
            models.map((model) => (
              <Button
                key={model}
                variant="ghost"
                className="w-full"
                onClick={() => {
                  handleModelChange(model);
                }}
              >
                {model}
              </Button>
            ))
          ) : (
            <Button variant="ghost" disabled className=" w-full">
              No models available
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </header>
  );
}
