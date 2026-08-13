import { describe, expect, it } from 'vitest'

import { HOME_SUMMARY } from './staticContent'

describe('home recommendation content', () => {
  it('uses the canonical campus directions scenario id', () => {
    expect(HOME_SUMMARY.pick.scenarioId).toBe('campus_directions')
  })
})
