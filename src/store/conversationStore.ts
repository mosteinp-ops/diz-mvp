import { create } from 'zustand'

export type MessageRole = 'user' | 'assistant' | 'system'

export interface ConversationMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: string
}

export interface OperationalMemoryItem {
  id: string
  kind:
    | 'pain'
    | 'pattern'
    | 'recurrence'
    | 'priority'
    | 'goal'
    | 'decision'
    | 'behavior'
    | 'financial_history'
    | 'emotional_context'
  content: string
  embedding?: number[]
  createdAt: string
}

interface ConversationState {
  messages: ConversationMessage[]
  liveTranscript: string
  isStreaming: boolean
  memory: OperationalMemoryItem[]
  addMessage: (role: MessageRole, content: string) => ConversationMessage
  setLiveTranscript: (value: string) => void
  setStreaming: (value: boolean) => void
  addMemory: (item: OperationalMemoryItem) => void
  reset: () => void
}

const now = () => new Date().toISOString()
const uid = () => Math.random().toString(36).slice(2)

export const useConversationStore = create<ConversationState>((set) => ({
  messages: [],
  liveTranscript: '',
  isStreaming: false,
  memory: [],
  addMessage: (role, content) => {
    const message: ConversationMessage = {
      id: uid(),
      role,
      content: content.trim(),
      createdAt: now(),
    }

    set((state) => ({ messages: [...state.messages, message] }))
    return message
  },
  setLiveTranscript: (value) => set({ liveTranscript: value }),
  setStreaming: (value) => set({ isStreaming: value }),
  addMemory: (item) => set((state) => ({ memory: [...state.memory, item] })),
  reset: () => set({ messages: [], liveTranscript: '', isStreaming: false, memory: [] }),
}))
