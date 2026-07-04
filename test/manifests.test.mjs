import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const root = new URL('..', import.meta.url)
const read = async (rel) => JSON.parse(await readFile(new URL(rel, root), 'utf8'))

test('marketplace.json lists eos-bank and eos-baas with repo-relative sources', async () => {
  const m = await read('.claude-plugin/marketplace.json')
  assert.equal(m.name, 'eos-dev-toolkit')
  const names = m.plugins.map((p) => p.name).sort()
  assert.deepEqual(names, ['eos-baas', 'eos-bank'])
  for (const p of m.plugins) {
    assert.match(p.source, /^\.\/plugins\/eos-(bank|baas)$/)
    assert.ok(p.description.length > 20)
  }
})

test('each plugin.json has matching name and a version', async () => {
  for (const persona of ['eos-bank', 'eos-baas']) {
    const p = await read(`plugins/${persona}/.claude-plugin/plugin.json`)
    assert.equal(p.name, persona)
    assert.match(p.version, /^\d+\.\d+\.\d+$/)
    assert.ok(p.description.length > 20)
  }
})
