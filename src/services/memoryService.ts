import { useConversationStore, type OperationalMemoryItem } from '../store/conversationStore'

export async function persistOperationalMemory(items: OperationalMemoryItem[]) {
  if (!items.length) return

  useConversationStore.getState().addMemory(items[0])

  await fetch('/api/memory/upsert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
}
