"use client";

import Chat, { ChatProps } from "./chat/chat";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

type MergedProps = ChatLayoutProps & ChatProps;

export function ChatLayout({ initialMessages, id }: MergedProps) {
  return (
    <SidebarProvider>
      <AppSidebar chatId={id} />
      <SidebarInset>
        <Chat id={id} initialMessages={initialMessages} />
      </SidebarInset>
    </SidebarProvider>
  );
}
