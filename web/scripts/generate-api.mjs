import { spawnSync } from 'node:child_process'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import openapiTS, { astToString } from 'openapi-typescript'

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const apiRoot = resolve(webRoot, '..', '..', 'k-manner-speech-api')
const output = resolve(webRoot, 'src', 'api', 'generated', 'schema.d.ts')
const uvArgs = [
  'run', '--with-requirements', 'requirements.txt', 'python', '-c',
  'import json; from app.main import app; print(json.dumps(app.openapi()))',
]
const result = spawnSync('uv', uvArgs, {
  cwd: apiRoot,
  encoding: 'utf8',
  env: {
    ...process.env,
    UV_CACHE_DIR: resolve(apiRoot, '.uv-cache'),
    UV_PYTHON_INSTALL_DIR: resolve(apiRoot, '.uv-python'),
  },
})
if (result.status !== 0) throw new Error(result.stderr || 'OpenAPI export failed')
const schema = JSON.parse(result.stdout)
const generated = astToString(await openapiTS(schema))

if (process.argv.includes('--check')) {
  const current = await readFile(output, 'utf8').catch(() => '')
  if (current !== generated) {
    console.error('Generated OpenAPI types are stale. Run npm run api:generate.')
    process.exit(1)
  }
} else {
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, generated, 'utf8')
}
