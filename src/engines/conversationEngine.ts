import { useConversationStore } from '../store/conversationStore'
import { callOperationalModel } from '../services/modelService'
import { persistOperationalMemory } from '../services/memoryService'

const bannedRobotPhrases = [
  'saquei',
  'como posso ajudar?',
  'deseja continuar?',
  'qual opção?',
  'confirma?',
  'escolha abaixo',
]

function sanitizeAssistantText(text: string): string {
  let sanitized = text
  for (const phrase of bannedRobotPhrases) {
    const regex = new RegExp(phrase, 'gi')
    sanitized = sanitized.replace(regex, '')
  }
  return sanitized.trim()
}

export async function sendMessage(text: string) {
  const state = useConversationStore.getState()
  const userMessage = state.addMessage('user', text)
  state.setStreaming(true)

  try {
    const response = await callOperationalModel({
      input: userMessage.content,
      messages: useConversationStore.getState().messages,
      memory: useConversationStore.getState().memory,
    })

    const clean = sanitizeAssistantText(response.output)
    const assistant = useConversationStore.getState().addMessage('assistant', clean)

    await persistOperationalMemory([
      {
        id: assistant.id,
        kind: 'pattern',
        content: clean,
        createdAt: assistant.createdAt,
      },
    ])

    return assistant
  } finally {
    useConversationStore.getState().setStreaming(false)
  }
}
