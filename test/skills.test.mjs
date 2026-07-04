import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'

const root = new URL('..', import.meta.url)

const DOCS_INDEX = {
  'eos-bank': 'https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/universe-portal-v1/llms.txt',
  'eos-baas': 'https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com/baas-portal-v1/llms.txt',
}

function parseFrontmatter(text) {
  assert.ok(text.startsWith('---\n'), 'must start with frontmatter fence')
  const end = text.indexOf('\n---', 4)
  assert.ok(end > 0, 'must close frontmatter')
  const block = text.slice(4, end)
  const name = block.match(/^name:\s*(.+)$/m)
  const desc = block.match(/^description:\s*(.+)$/m)
  assert.ok(name, 'has name')
  assert.ok(desc, 'has description')
  return { name: name[1].trim(), body: text.slice(end + 4) }
}

for (const persona of ['eos-bank', 'eos-baas']) {
  test(`${persona} core skills have valid frontmatter and reference the docs index`, async () => {
    const skillsDir = new URL(`plugins/${persona}/skills/`, root)
    const entries = (await readdir(skillsDir, { withFileTypes: true }))
      .filter((e) => e.isDirectory() && e.name !== 'products')
    assert.equal(entries.length, 3, 'exactly 3 core skills')
    for (const e of entries) {
      const text = await readFile(new URL(`${e.name}/SKILL.md`, skillsDir), 'utf8')
      const { name, body } = parseFrontmatter(text)
      assert.ok(name.startsWith(`${persona}-`), `${e.name}: name prefixed ${persona}-`)
      assert.ok(body.includes(DOCS_INDEX[persona]), `${e.name}: references docs index`)
      assert.ok(/Build with AI/i.test(body), `${e.name}: points at Build with AI for API base URL`)
    }
  })

  test(`${persona} AGENTS.md references the docs index`, async () => {
    const text = await readFile(new URL(`plugins/${persona}/AGENTS.md`, root), 'utf8')
    assert.ok(text.includes(DOCS_INDEX[persona]))
    assert.ok(/Build with AI/i.test(text))
  })
}
