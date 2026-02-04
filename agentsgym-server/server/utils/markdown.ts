import { parse as parseYaml } from 'yaml'

export type ParsedMarkdown = {
  frontmatter: Record<string, unknown>;
  content: string;
};

export function parseFrontmatter(markdownText: string): ParsedMarkdown {
  const text = markdownText.replace(/^\uFEFF/, '')
  const lines = text.split(/\r?\n/)
  if (lines.length === 0 || lines[0].trim() !== '---') {
    return { frontmatter: {}, content: markdownText }
  }

  let endIdx = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endIdx = i
      break
    }
  }
  if (endIdx === -1) {
    return { frontmatter: {}, content: markdownText }
  }

  const fmText = lines.slice(1, endIdx).join('\n').trim()
  const content = lines.slice(endIdx + 1).join('\n').replace(/^\n+/, '')
  let fm: unknown = {}
  try {
    fm = fmText ? parseYaml(fmText) : {}
  } catch {
    fm = {}
  }
  if (typeof fm !== "object" || fm === null || Array.isArray(fm)) {
    fm = {}
  }
  return { frontmatter: fm as Record<string, unknown>, content }
}

