// src/store/chatStore.ts
import {create} from 'zustand';

interface ChatState {
  chatVisible: boolean;
  toggleChat: () => void;
}

const useChatStore = create<ChatState>(set => ({
  chatVisible: false,
  toggleChat: () => set(state => ({chatVisible: !state.chatVisible})),
}));

export default useChatStore;
