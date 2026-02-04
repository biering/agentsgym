import type { SearchHit, Skill } from './types'

const WORD_RE = /[A-Za-z0-9][A-Za-z0-9_-]{1,}/g;

function tokens(text: string): string[] {
  const out: string[] = []
  const matches = text.matchAll(WORD_RE)
  for (const m of matches) out.push(m[0].toLowerCase())
  return out
}

function countMatches(toks: string[], q: Set<string>): number {
  let n = 0
  for (const t of toks) if (q.has(t)) n++
  return n
}

function snippet(text: string, q: Set<string>, maxLen = 220): string | undefined {
  if (!text) return undefined
  const lower = text.toLowerCase()
  let first: number | null = null
  for (const qt of q) {
    const idx = lower.indexOf(qt)
    if (idx !== -1 && (first === null || idx < first)) first = idx
  }
  if (first === null) return undefined
  const start = Math.max(0, first - 60)
  const end = Math.min(text.length, start + maxLen)
  let snip = text.slice(start, end).trim()
  if (start > 0) snip = `…${snip}`
  if (end < text.length) snip = `${snip}…`
  return snip
}

export type SearchParams = {
  query: string;
  limit: number;
  offset: number;
  categories?: string[];
};

export function search(skills: Skill[], params: SearchParams): SearchHit[] {
  const q = (params.query || '').trim()
  if (!q) return []
  const qTokens = new Set(tokens(q))
  if (qTokens.size === 0) return []

  const cats = (params.categories || []).map((c) => c.toLowerCase()).filter(Boolean)

  const scored: Array<{ score: number; skill: Skill; snippet?: string }> = []
  for (const s of skills) {
    const fm = s.frontmatter
    const sCats = fm.categories.map((c) => c.toLowerCase())
    if (cats.length > 0 && !cats.some((c) => sCats.includes(c))) continue

    const titleT = tokens(fm.title)
    const descT = tokens(fm.description)
    const catsT = fm.categories.map((c) => c.toLowerCase())
    const contentT = tokens(s.content)

    let score = 0
    score += 6 * countMatches(titleT, qTokens)
    score += 3 * countMatches(descT, qTokens)
    score += 2 * countMatches(catsT, qTokens)
    score += 1 * countMatches(contentT, qTokens)

    score = score / Math.log10(10 + contentT.length)
    if (score <= 0) continue

    scored.push({ score, skill: s, snippet: snippet(s.content, qTokens) })
  }

  scored.sort((a, b) => b.score - a.score)
  const window = scored.slice(params.offset, params.offset + params.limit)

  return window.map(({ score, skill, snippet: snip }) => ({
    id: skill.id,
    title: skill.frontmatter.title,
    description: skill.frontmatter.description,
    source: skill.frontmatter.source,
    categories: skill.frontmatter.categories,
    author: skill.frontmatter.author,
    githubUsername: skill.frontmatter.githubUsername,
    score: Math.round(score * 10000) / 10000,
    snippet: snip,
  }))
}

