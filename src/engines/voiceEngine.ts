import { useConversationStore } from '../store/conversationStore'

export class VoiceEngine {
  private recognition: SpeechRecognition | null = null
  private isListeningRef = { current: false }

  private get RecognitionCtor(): typeof SpeechRecognition | null {
    return (window.SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition ||
      null)
  }

  init(onFinalTranscript: (text: string) => void) {
    if (this.recognition) return

    const Ctor = this.RecognitionCtor
    if (!Ctor) return

    this.recognition = new Ctor()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'pt-BR'

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      useConversationStore.getState().setLiveTranscript(interimTranscript)

      if (finalTranscript.trim()) {
        onFinalTranscript(finalTranscript)
        useConversationStore.getState().setLiveTranscript('')
      }
    }

    this.recognition.onend = () => {
      if (this.isListeningRef.current && this.recognition) {
        this.recognition.start()
      }
    }
  }

  start() {
    if (!this.recognition) return
    this.isListeningRef.current = true
    this.recognition.start()
  }

  stop() {
    this.isListeningRef.current = false
    this.recognition?.stop()
  }

  speak(text: string, lang = 'pt-BR') {
    if (!text.trim()) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    window.speechSynthesis.speak(utterance)
  }
}
