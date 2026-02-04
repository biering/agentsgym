import fs from 'node:fs/promises'
import path from 'node:path'

import { parse as parseYaml } from 'yaml'

import { parseFrontmatter } from './markdown'
import type { Skill, SkillFrontmatter } from './types'

type StoreState = {
  skillsById: Map<string, Skill>
  loadedAtMs: number
}

let state: StoreState | null = null

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string')
}

function skillIdFromFilename(filename: string): string {
  return filename.replace(/\.md$/i, '')
}

export async function loadCategoriesFile(categoriesFile: string): Promise<unknown[]> {
  try {
    const raw = await fs.readFile(categoriesFile, 'utf-8')
    const data = parseYaml(raw) as any
    const cats = data?.categories
    return Array.isArray(cats) ? cats : []
  } catch {
    return []
  }
}

function validateFrontmatter(fm: Record<string, unknown>): SkillFrontmatter | null {
  const title = fm.title
  const description = fm.description
  const source = fm.source
  const categories = fm.categories
  const author = fm.author
  const githubUsername = fm.githubUsername

  if (typeof title !== 'string') return null
  if (typeof description !== 'string') return null
  if (source !== undefined && source !== null && typeof source !== 'string') return null
  if (!isStringArray(categories)) return null
  if (typeof author !== 'string') return null
  if (typeof githubUsername !== 'string') return null

  return {
    title,
    description,
    source: typeof source === 'string' ? source : undefined,
    categories,
    author,
    githubUsername,
  }
}

export async function loadSkills(contentDir: string): Promise<Map<string, Skill>> {
  const skills = new Map<string, Skill>()
  let entries: string[] = []
  try {
    entries = await fs.readdir(contentDir)
  } catch {
    return skills
  }

  for (const entry of entries) {
    if (!entry.toLowerCase().endsWith('.md')) continue
    const fullPath = path.join(contentDir, entry)
    let raw = ''
    try {
      raw = await fs.readFile(fullPath, 'utf-8')
    } catch {
      continue
    }
    const parsed = parseFrontmatter(raw)
    const fm = validateFrontmatter(parsed.frontmatter)
    if (!fm) continue

    const id = skillIdFromFilename(entry)
    skills.set(id, {
      id,
      path: entry,
      frontmatter: fm,
      content: parsed.content,
    })
  }
  return skills
}

export async function getStore(contentDir: string, reloadEachRequest: boolean): Promise<StoreState> {
  if (!state || reloadEachRequest) {
    const skillsById = await loadSkills(contentDir)
    state = { skillsById, loadedAtMs: Date.now() }
  }
  return state
}

