import path from 'node:path'
import { fileURLToPath } from 'node:url'

type E2eEnvironment = Record<string, string | undefined>

function origin(value: string): string {
  const parsed = new URL(value)
  if (parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error(`E2E URL must be an origin: ${value}`)
  }
  return parsed.origin
}

export function createE2eConfig(env: E2eEnvironment, webRoot: string) {
  const apiUrl = origin(env.E2E_API_URL ?? 'http://localhost:8000')
  const webUrl = origin(env.E2E_WEB_URL ?? 'http://localhost:5173')
  const apiRoot = env.E2E_API_ROOT
    ? path.resolve(env.E2E_API_ROOT)
    : path.resolve(webRoot, '../../k-manner-speech-api')

  return {
    apiUrl,
    webUrl,
    apiHealthUrl: `${apiUrl}/health`,
    apiRoot,
  }
}

const webRoot = path.dirname(fileURLToPath(import.meta.url))
export const E2E_CONFIG = createE2eConfig(process.env, webRoot)
