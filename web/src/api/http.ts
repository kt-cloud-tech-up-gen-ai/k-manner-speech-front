const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(message: string, status: number, code: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown }

let refreshInFlight: Promise<boolean> | null = null

function cookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1)
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase()
  let body: BodyInit | undefined
  if (options.body !== undefined) {
    if (typeof options.body === 'string') {
      body = options.body
    } else {
      body = JSON.stringify(options.body)
    }
  }

  const performRequest = () => {
    const headers = new Headers(options.headers)
    if (options.body !== undefined && typeof options.body !== 'string') {
      headers.set('Content-Type', 'application/json')
    }
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const csrf = cookie('csrf_token')
      if (csrf) headers.set('X-CSRF-Token', decodeURIComponent(csrf))
    }
    return fetch(`${API_URL}${path}`, {
      ...options,
      method,
      body,
      headers: Object.fromEntries(headers.entries()),
      credentials: 'include',
    })
  }

  let response: Response
  try {
    response = await performRequest()

    // access token은 짧게 만료되므로 refresh cookie가 살아 있으면 한 번 갱신하고
    // 원래 요청을 재시도한다. 갱신 응답이 CSRF도 회전시키므로 performRequest가
    // 재시도 시 헤더를 새로 조립해야 한다.
    const refreshExcluded = ['/auth/login', '/auth/signup', '/auth/refresh'].includes(path)
    if (response.status === 401 && !refreshExcluded) {
      refreshInFlight ??= (async () => {
        const headers = new Headers()
        const csrf = cookie('csrf_token')
        if (csrf) headers.set('X-CSRF-Token', decodeURIComponent(csrf))
        try {
          const refreshed = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: Object.fromEntries(headers.entries()),
            credentials: 'include',
          })
          return refreshed.ok
        } catch {
          return false
        }
      })().finally(() => {
        refreshInFlight = null
      })
      if (await refreshInFlight) response = await performRequest()
    }
  } catch {
    throw new ApiError('네트워크 연결을 확인하고 다시 시도해 주세요.', 0, 'NETWORK_ERROR')
  }
  if (response.status === 204) return undefined as T
  const payload = await response.json().catch(() => undefined)
  if (!response.ok) {
    const error = payload?.error
    throw new ApiError(
      error?.message ?? '요청을 처리할 수 없습니다.',
      error?.status ?? response.status,
      error?.code ?? 'HTTP_ERROR',
    )
  }
  return payload as T
}
