# QMD skill

This skill wraps [`qmd`](https://github.com/tobi/qmd) as a **local search engine for Markdown** so agents can retrieve only the relevant docs/snippets (often **~95% fewer tokens** vs dumping whole folders).

## Files
- `SKILL.md`: the skill prompt (OpenClaw-compatible; copy/paste into your agent system)

## Quick start
```bash
bun install -g https://github.com/tobi/qmd
brew install sqlite
qmd collection add /path/to/notes --name notes --mask "**/*.md"
qmd update
qmd search "your query"
```

## Recommended default
Use `qmd search` first. Only use `vsearch`/`query` when keyword search fails or you explicitly want semantic/hybrid results.

