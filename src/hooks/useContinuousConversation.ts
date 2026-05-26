import { useEffect, useMemo } from 'react'
import { VoiceEngine } from '../engines/voiceEngine'
import { sendMessage } from '../engines/conversationEngine'

export function useContinuousConversation() {
  const voice = useMemo(() => new VoiceEngine(), [])

  useEffect(() => {
    voice.init(async (text) => {
      const assistant = await sendMessage(text)
      voice.speak(assistant.content)
    })
  }, [voice])

  return {
    start: () => voice.start(),
    stop: () => voice.stop(),
  }
}
