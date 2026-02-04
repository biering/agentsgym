#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'

import { stringify as yamlStringify } from 'yaml'

function usage() {
  return `
agentsgym - search, fetch, and install skills from an AgentsGym server

Usage:
  npx agentsgym health [--base-url URL]
  npx agentsgym categories [--base-url URL]
  npx agentsgym search <query> [--base-url URL] [--limit N] [--offset N] [--category slug ...]
  npx agentsgym get <skillId> [--base-url URL]
  npx agentsgym install <skillId> [--base-url URL] [--dest-dir DIR] [--filename NAME]

Defaults:
  --base-url http://127.0.0.1:8787
`.trim()
}

function parseArgs(argv) {
  const args = [...argv]
  const cmd = args.shift() || ''

  const opts = {
    baseUrl: 'http://127.0.0.1:8787',
    limit: 10,
    offset: 0,
    categories: [],
    destDir: '.',
    filename: null,
  }

  const positionals = []
  while (args.length > 0) {
    const a = args.shift()
    if (a === '--base-url') opts.baseUrl = args.shift() || opts.baseUrl
    else if (a === '--limit') opts.limit = Number.parseInt(args.shift() || '10', 10)
    else if (a === '--offset') opts.offset = Number.parseInt(args.shift() || '0', 10)
    else if (a === '--category') opts.categories.push(args.shift() || '')
    else if (a === '--dest-dir') opts.destDir = args.shift() || opts.destDir
    else if (a === '--filename') opts.filename = args.shift() || null
    else if (a === '-h' || a === '--help') return { cmd: 'help', opts, positionals: [] }
    else positionals.push(a)
  }
  opts.categories = opts.categories.filter(Boolean)
  return { cmd, opts, positionals }
}

async function httpJson(baseUrl, p) {
  const url = new URL(p, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`)
  }
  return await res.json()
}

function frontmatterYaml(frontmatter) {
  const fm = yamlStringify(frontmatter, { sortMapEntries: false }).trim()
  return `---\n${fm}\n---\n`
}

async function main() {
  const { cmd, opts, positionals } = parseArgs(process.argv.slice(2))
  if (!cmd || cmd === 'help') {
    console.log(usage())
    process.exit(0)
  }

  if (cmd === 'health') {
    console.log(JSON.stringify(await httpJson(opts.baseUrl, 'health'), null, 2))
    return
  }

  if (cmd === 'categories') {
    console.log(JSON.stringify(await httpJson(opts.baseUrl, 'categories'), null, 2))
    return
  }

  if (cmd === 'search') {
    const query = positionals.join(' ').trim()
    if (!query) throw new Error('Missing <query>')
    const url = new URL('search', opts.baseUrl.endsWith('/') ? opts.baseUrl : `${opts.baseUrl}/`)
    url.searchParams.set('q', query)
    url.searchParams.set('limit', String(opts.limit))
    url.searchParams.set('offset', String(opts.offset))
    for (const c of opts.categories) url.searchParams.append('category', c)
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    console.log(JSON.stringify(await res.json(), null, 2))
    return
  }

  if (cmd === 'get') {
    const id = positionals[0]
    if (!id) throw new Error('Missing <skillId>')
    console.log(JSON.stringify(await httpJson(opts.baseUrl, `skills/${encodeURIComponent(id)}`), null, 2))
    return
  }

  if (cmd === 'install') {
    const id = positionals[0]
    if (!id) throw new Error('Missing <skillId>')
    const skill = await httpJson(opts.baseUrl, `skills/${encodeURIComponent(id)}`)
    const destDir = path.resolve(process.cwd(), opts.destDir)
    await fs.mkdir(destDir, { recursive: true })
    const outPath = path.join(destDir, opts.filename || `${skill.id}.md`)
    const fm = frontmatterYaml(skill.frontmatter)
    const body = `${fm}\n${String(skill.content || '').trimEnd()}\n`
    await fs.writeFile(outPath, body, 'utf-8')
    console.log(outPath)
    return
  }

  throw new Error(`Unknown command: ${cmd}`)
}

main().catch((err) => {
  console.error(err?.message || String(err))
  console.error('')
  console.error(usage())
  process.exit(1)
})

