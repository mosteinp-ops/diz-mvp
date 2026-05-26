# DIZ MVP — Arquitetura Refatorada

Este repositório foi estruturado para o novo modelo do DIZ com três motores:

- `VoiceEngine`: escuta contínua (`SpeechRecognition`), transcrição parcial/final, reinício automático, fala (`speechSynthesis`).
- `ConversationEngine`: contexto contínuo com Zustand, envio inline via `sendMessage`, limpeza de linguagem robótica e persistência de memória.
- `OperationalEngine`: geração de percepção operacional objetiva com risco e direção.

## Decisões-chave aplicadas

- Sem navegação por query string para transportar mensagem.
- Fluxo contínuo: ouvir → transcrever → enviar → responder → falar → continuar ouvindo.
- Fallback OpenAI → Gemini em indisponibilidade/429.
- Base para memória operacional persistente com embeddings/pgvector via endpoint dedicado.

## Estrutura

```txt
src/
  engines/
  hooks/
  services/
  store/
```
