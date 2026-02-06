import { createError, defineEventHandler, getQuery, setHeader } from 'h3'
import { getBaseUrlFromRequest, githubSkillHref, readSkillsIndex } from '../utils/skills'

function norm(s: string): string {
  return s.trim().toLowerCase()
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = norm(String(query.query ?? ''))
  if (!q) {
    throw createError({ statusCode: 400, statusMessage: 'Missing query' })
  }

  const index = await readSkillsIndex()

  // Simple substring match on slug/name/description, prefer slug prefix matches.
  const scored = index
    .map((s) => {
      const slug = norm(s.slug ?? '')
      const name = norm(s.name ?? '')
      const desc = norm(s.description ?? '')
      let score = 0
      if (slug.startsWith(q)) score += 100
      if (name.startsWith(q)) score += 80
      if (slug.includes(q)) score += 30
      if (name.includes(q)) score += 20
      if (desc.includes(q)) score += 5
      return { s, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)

  const best = scored[0]?.s
  if (!best) {
    throw createError({ statusCode: 404, statusMessage: 'No matches' })
  }

  const baseUrl = getBaseUrlFromRequest(event)
  setHeader(event, 'content-type', 'application/json; charset=utf-8')
  return {
    name: best.name ?? best.slug,
    href: githubSkillHref(best.slug),
    _links: {
      get: `${baseUrl}/api/skills/${encodeURIComponent(best.slug)}`,
    },
  }
})
