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

function cookie(name: string): string | undefined {
  return document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1)
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase()
  const headers = new Headers(options.headers)
  let body: BodyInit | undefined
  if (options.body !== undefined) {
    if (typeof options.body === 'string') {
      body = options.body
    } else {
      headers.set('Content-Type', 'application/json')
      body = JSON.stringify(options.body)
    }
  }
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrf = cookie('csrf_token')
    if (csrf) headers.set('X-CSRF-Token', decodeURIComponent(csrf))
  }
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      method,
      body,
      headers: Object.fromEntries(headers.entries()),
      credentials: 'include',
    })
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
