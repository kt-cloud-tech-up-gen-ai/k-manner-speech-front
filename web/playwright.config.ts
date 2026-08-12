import { defineConfig, devices } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { E2E_CONFIG } from './e2eConfig'

const webRoot = path.dirname(fileURLToPath(import.meta.url))
const apiOrigin = new URL(E2E_CONFIG.apiUrl)
const webOrigin = new URL(E2E_CONFIG.webUrl)

export default defineConfig({
  testDir: './e2e',
  timeout: 120_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: E2E_CONFIG.webUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: `uv run --with-requirements requirements.txt uvicorn app.main:app --env-file .env --host ${apiOrigin.hostname} --port ${apiOrigin.port}`,
      cwd: E2E_CONFIG.apiRoot,
      url: E2E_CONFIG.apiHealthUrl,
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: `npm run dev -- --host ${webOrigin.hostname} --port ${webOrigin.port}`,
      cwd: webRoot,
      url: E2E_CONFIG.webUrl,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
