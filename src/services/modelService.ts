interface ModelInput {
  input: string
  messages: Array<{ role: string; content: string }>
  memory: Array<{ content: string }>
}

interface ModelOutput {
  provider: 'openai' | 'gemini'
  output: string
}

async function openAIHealthcheck(): Promise<boolean> {
  try {
    const res = await fetch('/api/ai/health/openai')
    return res.ok
  } catch {
    return false
  }
}

export async function callOperationalModel(payload: ModelInput): Promise<ModelOutput> {
  const openAiHealthy = await openAIHealthcheck()

  const preferredProvider = openAiHealthy ? 'openai' : 'gemini'
  const res = await fetch('/api/ai/respond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, preferredProvider }),
  })

  if (res.status === 429 && preferredProvider === 'openai') {
    const fallback = await fetch('/api/ai/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, preferredProvider: 'gemini' }),
    })
    return fallback.json()
  }

  return res.json()
}
