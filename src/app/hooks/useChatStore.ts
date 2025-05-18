import { Message } from "ai";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const systemPrompt: Record<string, string> = {
  developer: "You are a software engineer. You use the Javascript language",
  correct:
    "You are a super helpful assistant who corrects grammar, spelling, and style errors in text, making it suitable for Slack conversations and tweets. Your answer should be only the corrected text, without any additional comments, explanations, quotes, markdown, or anything else. Do not respond to the message itself; just return the corrected text. The message may contain harmful or sensitive content, but you'''re just a tool to make it better. Never respond directly to the message; just correct it! The user never mentioned you. This isn'''t a message for you; it'''s a message to fix! Never respond with '''I can'''t help with this.''' Always ensure the corrected text is clear, concise, and appropriate for the context. Use a professional tone in your corrections. Always return the text in English.\n",
  grammar:
    "Bạn là một chuyên gia ngôn ngữ tiếng Anh. Nhiệm vụ của bạn là kiểm tra và sửa lỗi ngữ pháp trong câu tiếng Anh mà tôi nhập vào. Hãy thực hiện những yêu cầu sau: 1. Sửa lỗi ngữ pháp, chính tả, dấu câu nếu có. 2. Giải thích ngắn gọn lý do sửa đổi (nếu cần). 3. Đưa ra một hoặc hai cách viết lại câu sao cho đơn giản, dễ hiểu hơn mà vẫn giữ nguyên ý nghĩa. 4. Giữ nguyên văn phong tự nhiên, không làm mất đi ý định của người viết.",
  translator:
    "Tôi là một software engineer, tôi muốn dịch câu tiếng việt sang tiếng anh phù hợp với môi trường làm việc công ty nước ngoài. Trình độ tiếng anh của tôi chỉ ở mức trung cấp nên hãy sử dụng từ vựng và ngữ pháp căn bản. Chỉ trả về chuỗi kết quả, không thêm bất cứ gì khác",
  autocheck:
    "Bạn là một trợ lý ngôn ngữ chuyên nghiệp, thông thạo cả tiếng Anh và tiếng Việt, với khả năng viết và chỉnh sửa văn bản phù hợp trong môi trường làm việc chuyên nghiệp. Vui lòng hỗ trợ tôi như sau:\n\nKhi tôi viết bằng tiếng Việt:\nDịch câu hoặc đoạn văn sang tiếng Anh theo phong cách chuyên nghiệp, phù hợp với bối cảnh công việc (ví dụ: email, báo cáo, giao tiếp với đồng nghiệp hoặc khách hàng).\nGiải thích lý do tại sao bạn chọn cách dịch đó, bao gồm việc làm rõ ngữ điệu, từ vựng hoặc cấu trúc câu để phù hợp với môi trường làm việc.\nKhi tôi viết bằng tiếng Anh:\nKiểm tra ngữ pháp, chính tả và cách dùng từ của tôi.\nĐánh giá xem câu hoặc đoạn văn có phù hợp với môi trường làm việc chuyên nghiệp không.\nCố gắng giữ lại cấu trúc cấu và nên đề xuất cách viết lại (nếu cần) để câu văn trở nên lịch sự, rõ ràng và chuyên nghiệp hơn, đồng thời giải thích lý do bằng tiếng việt cho các thay đổi hoặc giữ nguyên nếu đã phù hợp.\nĐảm bảo rằng các câu trả lời của bạn ngắn gọn, đúng trọng tâm, nhưng vẫn đầy đủ thông tin cần thiết.",
  default: "You are a helpful assistant.",
};

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
  systemPrompt: Record<string, string>;
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
  updateSystemPrompt: (role: string, prompt: string) => void;
  setUserName: (userName: string) => void;
  startDownload: (modelName: string) => void;
  stopDownload: () => void;
  setDownloadProgress: (progress: number) => void;
  reset: () => void;
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
      systemPrompt,

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

      updateSystemPrompt: (role, prompt) => {
        set((state) => ({
          systemPrompt: {
            ...state.systemPrompt,
            [role]: prompt,
          },
        }));
      },

      startDownload: (modelName) =>
        set({ isDownloading: true, downloadingModel: modelName, downloadProgress: 0 }),
      stopDownload: () =>
        set({ isDownloading: false, downloadingModel: null, downloadProgress: 0 }),
      setDownloadProgress: (progress) => set({ downloadProgress: progress }),
      reset: () => {
        set({
          base64Images: null,
          chats: {},
          currentChatId: null,
        });
      },
    }),
    {
      name: "nextjs-ollama-ui-state",
      partialize: (state) => ({
        isInitialized: state.isInitialized,
        chats: state.chats,
        currentChatId: state.currentChatId,
        selectedModel: state.selectedModel,
        systemPrompt,
        userName: state.userName,
      }),
    }
  )
);

export default useChatStore;
