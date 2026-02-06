import { defineEventHandler, setHeader } from 'h3'
import { assertValidSlug, readSkillMarkdown } from '../../utils/skills'

export default defineEventHandler(async (event) => {
  const slug = String(event.context.params?.slug ?? '')
  assertValidSlug(slug)

  const markdown = await readSkillMarkdown(slug)
  setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=60')
  return markdown
})
