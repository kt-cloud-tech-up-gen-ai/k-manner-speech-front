import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiRequest = vi.hoisted(() => vi.fn())
vi.mock('./http', () => ({ apiRequest }))

import { processTextTurn, processVoiceTurn } from './client'

const turnResponse = {
  user_message: { id: 'user-1', room_id: 'room-1', role: 'user', content: '안녕하세요' },
  assistant_message: {
    id: 'assistant-1', room_id: 'room-1', role: 'assistant', content: '반가워요',
    audio_url: '/rooms/room-1/messages/assistant-1/audio',
  },
  conversation: {
    answer: '반가워요', response_style: '밝게', audio: { audio_path: '/tmp/a.wav' },
    voice_emotion: {
      emotions: [
        { label: '차분함', percentage: 70 },
        { label: '친절함', percentage: 20 },
        { label: '긴장감', percentage: 10 },
      ],
      impressions: ['차분하게 들려요'],
    },
  },
  feedback: {
    score: 88, summary: '자연스러워요', strengths: [], improvements: ['혹시를 넣어 보세요'], issues: [],
  },
}

describe('conversation turn payloads', () => {
  beforeEach(() => {
    apiRequest.mockReset()
    apiRequest.mockResolvedValue(turnResponse)
  })

  it('sends recorded audio with a voice turn and maps voice-only feedback', async () => {
    const result = await processVoiceTurn('room-1', '안녕하세요', {
      audioBase64: 'UklGRg==', mimeType: 'audio/wav', durationSeconds: 1.4,
    })

    expect(apiRequest).toHaveBeenCalledWith('/rooms/room-1/turns/voice', {
      method: 'POST',
      body: {
        transcript: '안녕하세요', audio_base64: 'UklGRg==',
        audio_mime_type: 'audio/wav', duration_seconds: 1.4,
      },
    })
    expect(result.messages[0]?.feedback?.voiceEmotion?.emotions[0]?.label).toBe('차분함')
    expect(result.messages[0]?.feedback?.inputType).toBe('voice')
  })

  it('does not send or expose voice emotion for a text turn', async () => {
    const result = await processTextTurn('room-1', '안녕하세요')

    expect(apiRequest).toHaveBeenCalledWith('/rooms/room-1/turns/text', {
      method: 'POST', body: { text: '안녕하세요' },
    })
    expect(result.messages[0]?.feedback?.voiceEmotion).toBeUndefined()
    expect(result.messages[0]?.feedback?.inputType).toBe('text')
  })
})
