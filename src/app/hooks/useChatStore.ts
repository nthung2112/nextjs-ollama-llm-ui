import { Message } from "ai";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatSession {
  messages: Message[];
  createdAt: string;
  role: string;
}

interface State {
  isInitialized: boolean;
  base64Images: string[] | null;
  chats: Record<string, ChatSession>;
  currentChatId: string | null;
  selectedModel: string | null;
  userName: string | "Anonymous";
  isDownloading: boolean;
  downloadProgress: number;
  downloadingModel: string | null;
}

interface Actions {
  setIsInitialized: (value: boolean) => void;
  setBase64Images: (base64Images: string[] | null) => void;
  setCurrentChatId: (chatId: string) => void;
  setSelectedModel: (selectedModel: string) => void;
  getChatById: (chatId: string) => ChatSession | undefined;
  getRoleById: (chatId: string) => string | undefined;
  getMessagesById: (chatId: string) => Message[];
  createNewChat: (chatId: string, role: string) => void;
  saveMessages: (chatId: string, messages: Message[]) => void;
  handleDelete: (chatId: string, messageId?: string) => void;
  setUserName: (userName: string) => void;
  startDownload: (modelName: string) => void;
  stopDownload: () => void;
  setDownloadProgress: (progress: number) => void;
}

const useChatStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      isInitialized: false,
      base64Images: null,
      chats: {},
      currentChatId: null,
      selectedModel: null,
      userName: "",
      isDownloading: false,
      downloadProgress: 0,
      downloadingModel: null,

      setBase64Images: (base64Images) => set({ base64Images }),
      setUserName: (userName) => set({ userName }),
      setIsInitialized: (isInitialized) => set({ isInitialized }),

      setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      getChatById: (chatId) => {
        const state = get();
        return state.chats[chatId];
      },
      getRoleById: (chatId) => {
        const state = get();
        return state.chats[chatId]?.role;
      },
      getMessagesById: (chatId) => {
        const state = get();
        return state.chats[chatId]?.messages || [];
      },
      createNewChat: (chatId, role) => {
        set((state) => {
          const existingChat = state.chats[chatId];

          return {
            chats: {
              ...state.chats,
              [chatId]: {
                messages: existingChat?.messages || [],
                createdAt: existingChat?.createdAt || new Date().toISOString(),
                role,
              },
            },
          };
        });
      },
      saveMessages: (chatId, messages) => {
        set((state) => {
          const existingChat = state.chats[chatId];

          return {
            chats: {
              ...state.chats,
              [chatId]: {
                messages: [...messages],
                createdAt: existingChat?.createdAt || new Date().toISOString(),
                role: existingChat?.role,
              },
            },
          };
        });
      },
      handleDelete: (chatId, messageId) => {
        set((state) => {
          const chat = state.chats[chatId];
          if (!chat) return state;

          // If messageId is provided, delete specific message
          if (messageId) {
            const updatedMessages = chat.messages.filter((message) => message.id !== messageId);
            return {
              chats: {
                ...state.chats,
                [chatId]: {
                  ...chat,
                  messages: updatedMessages,
                },
              },
            };
          }

          // If no messageId, delete the entire chat
          const { [chatId]: _, ...remainingChats } = state.chats;
          return {
            chats: remainingChats,
          };
        });
      },

      startDownload: (modelName) =>
        set({ isDownloading: true, downloadingModel: modelName, downloadProgress: 0 }),
      stopDownload: () =>
        set({ isDownloading: false, downloadingModel: null, downloadProgress: 0 }),
      setDownloadProgress: (progress) => set({ downloadProgress: progress }),
    }),
    {
      name: "nextjs-ollama-ui-state",
      partialize: (state) => ({
        isInitialized: state.isInitialized,
        chats: state.chats,
        currentChatId: state.currentChatId,
        selectedModel: state.selectedModel,
        userName: state.userName,
      }),
    }
  )
);

export default useChatStore;
