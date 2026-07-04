import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PERSONAS, productsManifestUrl, skillUrl, localSkillPath, canonicalProductDir, planSync, syncPersona } from '../scripts/sync-product-skills.mjs'
import { mkdtemp, mkdir, writeFile, readFile, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

test('PERSONAS map plugins to their S3 roots', () => {
  const byPlugin = Object.fromEntries(PERSONAS.map((p) => [p.plugin, p.root]))
  assert.match(byPlugin['eos-bank'], /universe-portal-v1$/)
  assert.match(byPlugin['eos-baas'], /baas-portal-v1$/)
})

test('URL + path builders', () => {
  const root = 'https://x/universe-portal-v1'
  assert.equal(productsManifestUrl(root), 'https://x/universe-portal-v1/products/manifest.json')
  assert.equal(skillUrl(root, 'deposits'), 'https://x/universe-portal-v1/agent-skills/products/deposits/SKILL.md')
  assert.equal(canonicalProductDir('eos-bank', 'deposits'), 'eos-bank-deposits')
  assert.equal(
    localSkillPath('/repo/plugins/eos-bank', 'eos-bank', 'deposits'),
    '/repo/plugins/eos-bank/skills/products/eos-bank-deposits/SKILL.md',
  )
})

test('planSync fetches manifest slugs and prunes stale canonical dirs', () => {
  const manifest = { products: [{ slug: 'deposits' }, { slug: 'loans' }] }
  const plan = planSync(manifest, ['eos-bank-deposits', 'eos-bank-retired'], 'eos-bank')
  assert.deepEqual(plan.fetch.sort(), ['deposits', 'loans'])
  assert.deepEqual(plan.prune, ['eos-bank-retired'])
})

test('planSync does not mis-fire on bare-slug legacy dirs that happen to differ from canonical names', () => {
  const manifest = { products: [{ slug: 'deposits' }] }
  // A legacy bare-slug dir ("deposits") is not the canonical name ("eos-bank-deposits"),
  // so it is correctly flagged for pruning rather than being mistaken for the wanted dir.
  const plan = planSync(manifest, ['deposits', 'eos-bank-deposits'], 'eos-bank')
  assert.deepEqual(plan.fetch, ['deposits'])
  assert.deepEqual(plan.prune, ['deposits'])
})

test('syncPersona writes manifest skills and prunes stale product dirs', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'eos-sync-'))
  const pluginDir = join(repoRoot, 'plugins', 'eos-bank', 'skills', 'products')
  await mkdir(join(pluginDir, 'eos-bank-retired'), { recursive: true })
  await writeFile(join(pluginDir, 'eos-bank-retired', 'SKILL.md'), 'old')

  const fetchImpl = async (url) => {
    if (url.endsWith('/products/manifest.json')) {
      return { ok: true, text: async () => JSON.stringify({ products: [{ slug: 'deposits' }] }) }
    }
    if (url.endsWith('/agent-skills/products/deposits/SKILL.md')) {
      return { ok: true, text: async () => '---\nname: eos-bank-deposits\n---\n# Deposits' }
    }
    return { ok: false, status: 404, text: async () => '' }
  }

  const persona = { plugin: 'eos-bank', root: 'https://x/universe-portal-v1' }
  const res = await syncPersona(persona, { fetchImpl, repoRoot })

  assert.deepEqual(res.written, ['deposits'])
  assert.deepEqual(res.pruned, ['eos-bank-retired'])
  const written = await readFile(join(pluginDir, 'eos-bank-deposits', 'SKILL.md'), 'utf8')
  assert.match(written, /name: eos-bank-deposits/)
  const remaining = (await readdir(pluginDir, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name)
  assert.deepEqual(remaining, ['eos-bank-deposits'])
})

test('syncPersona throws on a failed manifest fetch (fail-closed, no partial wipe)', async () => {
  const repoRoot = await mkdtemp(join(tmpdir(), 'eos-sync-'))
  const fetchImpl = async () => ({ ok: false, status: 500, text: async () => '' })
  await assert.rejects(() => syncPersona({ plugin: 'eos-bank', root: 'https://x/universe-portal-v1' }, { fetchImpl, repoRoot }))
})
