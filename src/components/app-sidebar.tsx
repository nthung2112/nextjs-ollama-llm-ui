"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  BrainCog,
  FileCode,
  Globe,
  MoreHorizontal,
  PlusIcon,
  Shell,
  SpellCheck2,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import useChatStore from "@/app/hooks/useChatStore";
import { NavUser } from "./nav-user";
import { triggerCustomEvent } from "@/app/hooks/useCustomEvent";

interface SidebarProps {
  chatId: string;
}

const roles = [
  {
    name: "Translator English",
    id: "translate-english",
    key: "translator",
    icon: () => <Globe />,
  },
  {
    name: "Check Grammar",
    id: "check-grammar",
    key: "grammar",
    icon: () => <SpellCheck2 />,
  },
  {
    name: "Dev Code",
    id: "dev-code",
    key: "developer",
    icon: () => <FileCode />,
  },
  {
    name: "Auto Correct",
    id: "auto-correct",
    key: "correct",
    icon: () => <BrainCog />,
  },
  {
    name: "Auto Detect",
    id: "auto-detect",
    key: "autocheck",
    icon: () => <Shell />,
  },
];

export function AppSidebar({ chatId }: SidebarProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const allChats = useChatStore((state) => state.chats);
  const handleDelete = useChatStore((state) => state.handleDelete);
  const createNewChat = useChatStore((state) => state.createNewChat);
  const saveMessages = useChatStore((state) => state.saveMessages);

  const chats = Object.entries(allChats)
    .filter(([, chat]) => !chat.role)
    .sort(([, a], [, b]) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const openDefaultChat = (role: { id: string; key: string }) => () => {
    setOpenMobile(false);
    createNewChat(role.id, role.key);
    router.push(`/c/${role.id}`);
  };

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center px-2"
            >
              <Image
                src="/ollama.png"
                alt="AI"
                width={28}
                height={28}
                className="object-contain dark:invert"
              />
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push("/");
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Default chat</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {roles.map((role) => (
                <SidebarMenuItem key={role.name}>
                  <SidebarMenuButton onClick={openDefaultChat(role)} isActive={role.id === chatId}>
                    <role.icon />
                    <span>{role.name}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full flex gap-2 hover:text-red-500 text-red-500 justify-start items-center"
                          >
                            <Trash2 className="shrink-0 w-4 h-4" />
                            Clear chat
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader className="space-y-4">
                            <DialogTitle>Clear chat?</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to clear this chat? This action cannot be
                              undone.
                            </DialogDescription>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerCustomEvent("reset-chat", {
                                      chatId,
                                    });
                                  }}
                                >
                                  Delete
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map(([id, chat]) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton asChild isActive={id === chatId}>
                    <Link key={id} href={`/c/${id}`}>
                      <span>{chat.messages.length > 0 ? chat.messages[0].content : ""}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction>
                        <MoreHorizontal />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full flex gap-2 hover:text-red-500 text-red-500 justify-start items-center"
                          >
                            <Trash2 className="shrink-0 w-4 h-4" />
                            Delete chat
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader className="space-y-4">
                            <DialogTitle>Delete chat?</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this chat? This action cannot be
                              undone.
                            </DialogDescription>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(id);
                                  router.push("/");
                                }}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
