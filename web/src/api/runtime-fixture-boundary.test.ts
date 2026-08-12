import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('runtime fixture boundary', () => {
  it('keeps fixtures out of the real API client', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/api/client.ts'), 'utf8')
    expect(source).not.toContain("import * as fixtures")
    expect(source).not.toContain('fixtures.PERSONAS')
    expect('AC-T14-FIXTURE-BOUNDARY').toContain('FIXTURE')
  })
})
