import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from './http'

describe('apiRequest', () => {
  afterEach(() => vi.restoreAllMocks())

  it('includes browser credentials and CSRF for mutations', async () => {
    Object.defineProperty(document, 'cookie', { configurable: true, value: 'csrf_token=csrf-value' })
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    await apiRequest('/rooms', { method: 'POST', body: { name: '연습' } })
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/^http:\/\/(localhost|127\.0\.0\.1):8000\/rooms$/),
      expect.objectContaining({
        credentials: 'include',
        headers: expect.objectContaining({ 'x-csrf-token': 'csrf-value' }),
      }),
    )
    expect('AC-T8-CREDENTIALS-ERROR-UX').toContain('CREDENTIALS')
  })

  it('turns a server envelope into a typed error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ error: { code: 'RATE_LIMITED', message: '잠시 후 다시 시도해 주세요.', status: 429 } }),
        { status: 429, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    await expect(apiRequest('/rooms')).rejects.toMatchObject({
      code: 'RATE_LIMITED', status: 429, message: '잠시 후 다시 시도해 주세요.',
    })
  })

  it('refreshes an expired cookie session for /auth/me and retries once', async () => {
    Object.defineProperty(document, 'cookie', { configurable: true, value: 'csrf_token=csrf-value' })
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ user: { id: 'user-1' } }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ user: { id: 'user-1' }, profile: {} }), {
        status: 200, headers: { 'Content-Type': 'application/json' },
      }))

    await expect(apiRequest('/auth/me')).resolves.toEqual({ user: { id: 'user-1' }, profile: {} })
    expect(fetchMock.mock.calls.map(([url]) => new URL(String(url)).pathname)).toEqual([
      '/auth/me',
      '/auth/refresh',
      '/auth/me',
    ])
  })
})
