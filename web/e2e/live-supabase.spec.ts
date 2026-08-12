import { expect, test, type Page } from '@playwright/test'

import { E2E_CONFIG } from '../e2eConfig'

const apiBaseUrl = E2E_CONFIG.apiUrl

async function startFirstPractice(page: Page) {
  await page.goto('/personas')
  await expect(page.getByRole('heading', { name: /페르소나/ })).toBeVisible()
  await page.locator('button').filter({ hasText: '도윤' }).first().click()
  await expect(page.getByRole('heading', { name: /시나리오/ })).toBeVisible()
  const roomResponse = page.waitForResponse((response) =>
    response.url().endsWith('/rooms') && response.request().method() === 'POST',
  )
  await page.getByRole('button', { name: /같이 수업/ }).click()
  const room = await (await roomResponse).json() as { id: string }
  await expect(page.getByLabel('메시지 입력')).toBeVisible()
  return room.id
}

async function sendTurn(page: Page, text: string) {
  await page.getByLabel('메시지 입력').fill(text)
  const responsePromise = page.waitForResponse((response) =>
    response.url().includes('/messages') && response.request().method() === 'POST',
  )
  await page.getByRole('button', { name: '보내기' }).click()
  const response = await responsePromise
  expect(response.ok(), `message API returned ${response.status()}`).toBeTruthy()
  await expect(page.getByText(text, { exact: true })).toBeVisible()
}

test.describe('live supabase sync flow', () => {
  test('member signs up, practices, receives Gemini feedback, and withdraws', async ({ page }) => {
    const email = `codex-e2e-${Date.now()}@example.com`
    let signedUp = false

    try {
      await page.goto('/login')
      await page.getByRole('button', { name: /회원가입/ }).click()
      await page.getByLabel('이메일').fill(email)
      await page.getByLabel('비밀번호').fill('Codex-e2e-password-2026!')
      await page.getByRole('button', { name: '회원가입', exact: true }).click()
      await expect(page).toHaveURL(/\/home$/)
      signedUp = true

      const roomId = await startFirstPractice(page)
      await sendTurn(page, '오늘 수업 정말 재미있었어요.')

      const stored = await page.evaluate(async ({ apiBaseUrl, roomId }) => {
        const response = await fetch(`${apiBaseUrl}/rooms/${roomId}/messages`, { credentials: 'include' })
        return response.json()
      }, { apiBaseUrl, roomId }) as { messages: Array<{ role: string }> }
      expect(stored.messages).toContainEqual(expect.objectContaining({ role: 'user' }))

      const feedbackResponse = page.waitForResponse((response) =>
        response.url().includes('/feedback') && response.request().method() === 'POST',
      )
      await page.getByRole('button', { name: /피드백 보기/ }).last().click()
      expect((await feedbackResponse).ok(), 'Gemini feedback API must succeed').toBeTruthy()
      await expect(page.getByRole('dialog', { name: '답변 피드백' })).toContainText('대화 분석 완료')

      await page.goto('/settings')
      await page.getByRole('button', { name: /회원탈퇴.*데이터 삭제/ }).click()
      const withdrawResponse = page.waitForResponse((response) =>
        response.url().endsWith('/auth/me') && response.request().method() === 'DELETE',
      )
      await page.getByRole('button', { name: '탈퇴', exact: true }).click()
      expect((await withdrawResponse).status(), 'AC-E2E-LIVE-COOKIE-FLOW').toBe(204)
      await expect(page).toHaveURL(/\/splash$/)
      signedUp = false
    } finally {
      if (signedUp) {
        await page.goto('/settings')
        await page.getByRole('button', { name: /회원탈퇴.*데이터 삭제/ }).click().catch(() => {})
        await page.getByRole('button', { name: '탈퇴', exact: true }).click().catch(() => {})
      }
    }
  })

  test('guest completes exactly three message exchanges with the signed cookie', async ({ page }) => {
    await startFirstPractice(page)
    for (const text of ['안녕하세요.', '같이 공부해서 좋아요.', '다음에도 함께 공부해요.']) {
      await sendTurn(page, text)
    }

    const body = await page.evaluate(async (url) => {
      const response = await fetch(`${url}/rooms`, { credentials: 'include' })
      if (!response.ok) throw new Error(`rooms API returned ${response.status}`)
      return response.json()
    }, apiBaseUrl) as { rooms: Array<{ guest: boolean; turn_count: number; status: string }> }
    expect(body.rooms).toContainEqual(expect.objectContaining({ guest: true, turn_count: 3, status: 'completed' }))
  })
})
