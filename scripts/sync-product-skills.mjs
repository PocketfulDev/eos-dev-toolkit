import { mkdir, writeFile, rm, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const S3 = 'https://backoffice-documentation-bucket.s3.eu-west-1.amazonaws.com'

// Interim direct-S3 roots (swap to the CDN host when infra confirms it).
export const PERSONAS = [
  { plugin: 'eos-bank', root: `${S3}/universe-portal-v1` },
  { plugin: 'eos-baas', root: `${S3}/baas-portal-v1` },
]

export const productsManifestUrl = (root) => `${root}/products/manifest.json`
export const skillUrl = (root, slug) => `${root}/agent-skills/products/${slug}/SKILL.md`
export const canonicalProductDir = (plugin, slug) => `${plugin}-${slug}`
export const localSkillPath = (pluginDir, plugin, slug) =>
  join(pluginDir, 'skills', 'products', canonicalProductDir(plugin, slug), 'SKILL.md')

export function planSync(manifest, existingDirs, plugin) {
  const fetchSlugs = (manifest.products ?? []).map((p) => p.slug)
  const wantedDirs = new Set(fetchSlugs.map((slug) => canonicalProductDir(plugin, slug)))
  return { fetch: fetchSlugs, prune: existingDirs.filter((d) => !wantedDirs.has(d)) }
}

async function existingProductDirs(productsDir) {
  try {
    const entries = await readdir(productsDir, { withFileTypes: true })
    return entries.filter((e) => e.isDirectory()).map((e) => e.name)
  } catch (err) {
    if (err.code === 'ENOENT') return []
    throw err
  }
}

export async function syncPersona(persona, { fetchImpl = fetch, repoRoot = process.cwd() } = {}) {
  const pluginDir = join(repoRoot, 'plugins', persona.plugin)
  const productsDir = join(pluginDir, 'skills', 'products')

  const manifestRes = await fetchImpl(productsManifestUrl(persona.root))
  if (!manifestRes.ok) {
    throw new Error(`${persona.plugin}: manifest fetch failed (${manifestRes.status})`)
  }
  const manifest = JSON.parse(await manifestRes.text())
  const plan = planSync(manifest, await existingProductDirs(productsDir), persona.plugin)

  const written = []
  for (const slug of plan.fetch) {
    const res = await fetchImpl(skillUrl(persona.root, slug))
    if (!res.ok) {
      throw new Error(`${persona.plugin}/${slug}: skill fetch failed (${res.status})`)
    }
    const dest = localSkillPath(pluginDir, persona.plugin, slug)
    await mkdir(dirname(dest), { recursive: true })
    await writeFile(dest, await res.text())
    written.push(slug)
  }
  for (const dirName of plan.prune) {
    await rm(join(productsDir, dirName), { recursive: true, force: true })
  }
  return { written, pruned: plan.prune }
}

export async function main() {
  for (const persona of PERSONAS) {
    const res = await syncPersona(persona)
    console.log(`${persona.plugin}: wrote ${res.written.length}, pruned ${res.pruned.length}`)
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((err) => {
    console.error(err.message)
    process.exit(1)
  })
}
