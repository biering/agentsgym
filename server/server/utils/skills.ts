import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createError } from 'h3'

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DEFAULT_GITHUB_REPO = 'biering/agentsgym'

export type SkillIndexEntry = {
  slug: string
  name: string
  description?: string
  homepage?: string
}

export function assertValidSlug(slug: string): void {
  if (!SLUG_RE.test(slug)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid slug',
    })
  }
}

export function getBaseUrlFromRequest(event: any): string {
  const req = event?.node?.req
  const headers = req?.headers ?? {}
  const proto =
    (headers['x-forwarded-proto'] as string | undefined) ??
    (headers['x-forwarded-protocol'] as string | undefined) ??
    'http'
  const host =
    (headers['x-forwarded-host'] as string | undefined) ??
    (headers.host as string | undefined) ??
    'localhost'
  return `${proto}://${host}`
}

export function githubSkillHref(slug: string): string {
  assertValidSlug(slug)
  const repo = process.env.AGENTSGYM_GITHUB_REPO ?? DEFAULT_GITHUB_REPO // e.g. "owner/repo"
  const ref = process.env.AGENTSGYM_GITHUB_REF ?? 'main' // branch/tag/sha
  return `https://github.com/${repo}/blob/${ref}/skills/${slug}/SKILL.md`
}

export function repoRoot(): string {
  const explicit = process.env.AGENTSGYM_REPO_ROOT
  if (explicit) return explicit

  // Support running the Nitro app from `server/` while the `skills/` folder
  // lives at the repo root (sibling of `server/`).
  const cwd = process.cwd()
  const candidates = [cwd, path.resolve(cwd, '..')]
  for (const candidate of candidates) {
    if (existsSync(path.join(candidate, 'skills', 'index.json'))) return candidate
  }
  return cwd
}

export async function readSkillMarkdown(slug: string): Promise<string> {
  assertValidSlug(slug)
  const filePath = path.join(repoRoot(), 'skills', slug, 'SKILL.md')
  try {
    return await readFile(filePath, 'utf8')
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      throw createError({ statusCode: 404, statusMessage: 'Skill not found' })
    }
    throw err
  }
}

export async function readSkillsIndex(): Promise<SkillIndexEntry[]> {
  const filePath = path.join(repoRoot(), 'skills', 'index.json')
  try {
    const raw = await readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      throw createError({ statusCode: 500, statusMessage: 'Invalid skills index' })
    }
    return parsed as SkillIndexEntry[]
  } catch (err: any) {
    if (err?.code === 'ENOENT') {
      throw createError({ statusCode: 404, statusMessage: 'Index not found' })
    }
    throw err
  }
}
