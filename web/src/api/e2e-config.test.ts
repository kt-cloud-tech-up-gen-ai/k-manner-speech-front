import { describe, expect, it } from 'vitest'

import { createE2eConfig } from '../../e2eConfig'

describe('E2E configuration', () => {
  it('keeps local development defaults in one source', () => {
    const config = createE2eConfig(
      {},
      'C:/workspace/Basic_project_front/k-manner-speech-front/web',
    )

    expect(config.apiUrl, 'AC-E2E-ORIGINS-SINGLE-SOURCE').toBe('http://localhost:8000')
    expect(config.webUrl).toBe('http://localhost:5173')
    expect(config.apiHealthUrl).toBe('http://localhost:8000/health')
    expect(config.apiRoot.replaceAll('\\', '/')).toBe(
      'C:/workspace/Basic_project_api/k-manner-speech-api',
    )
  })

  it('applies URL and API root overrides consistently', () => {
    const config = createE2eConfig(
      {
        E2E_API_URL: 'http://127.0.0.1:9100/',
        E2E_WEB_URL: 'http://127.0.0.1:9200/',
        E2E_API_ROOT: 'D:/repos/api',
      },
      'C:/workspace/Basic_project_front/k-manner-speech-front/web',
    )

    expect(config.apiUrl, 'AC-E2E-ORIGINS-SINGLE-SOURCE').toBe('http://127.0.0.1:9100')
    expect(config.webUrl).toBe('http://127.0.0.1:9200')
    expect(config.apiHealthUrl).toBe('http://127.0.0.1:9100/health')
    expect(config.apiRoot.replaceAll('\\', '/'), 'AC-E2E-API-ROOT-CONFIGURABLE').toBe(
      'D:/repos/api',
    )
  })
})
