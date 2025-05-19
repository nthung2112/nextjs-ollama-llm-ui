"use client";

import { useRouter } from "next/navigation";
import { GearIcon } from "@radix-ui/react-icons";
import { MoreVerticalIcon, ZapOff } from "lucide-react";

import useChatStore from "@/app/hooks/useChatStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

import EditUsernameForm from "./edit-username-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function NavUser() {
  const userName = useChatStore((state) => state.userName);
  const reset = useChatStore((state) => state.reset);
  const router = useRouter();

  const handleClearAll = () => {
    const confirmation = confirm("Are you sure you want to clear all chats?");
    if (confirmation) {
      reset();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src="" alt="AI" width={4} height={4} className="object-contain" />
                <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userName}</span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="top"
            align="center"
            sideOffset={4}
          >
            <DropdownMenuItem onSelect={handleClearAll}>
              <div className="flex w-full gap-2 p-1 items-center cursor-pointer">
                <ZapOff className="w-4 h-4" />
                <p>Clear all</p>
              </div>
            </DropdownMenuItem>
            <Dialog>
              <DialogTrigger className="w-full">
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <div className="flex w-full gap-2 p-1 items-center cursor-pointer">
                    <GearIcon className="w-4 h-4" />
                    Settings
                  </div>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="space-y-4">
                  <DialogTitle>Settings</DialogTitle>
                  <EditUsernameForm />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
