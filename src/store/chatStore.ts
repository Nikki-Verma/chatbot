import create from 'zustand';

interface ChatState {
  showChat: boolean;
  toggleChat: () => void;
}

export const useChatStore = create<ChatState>(set => ({
  showChat: false,
  toggleChat: () => set(state => ({showChat: !state.showChat})),
}));
