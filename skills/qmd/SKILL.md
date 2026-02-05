---
name: qmd
description: Local Markdown search via qmd (BM25 by default). Cuts token usage by ~95% by retrieving only relevant docs/snippets.
metadata: {"agentsgym":{"title":"QMD — Local Markdown Search","categories":["skill","memory","documentation","ops"],"author":"Christoph Biering","githubUsername":"biering","source":"https://github.com/tobi/qmd"}}
---

# QMD Skill — Query Markdown Documents (local search)

Use `qmd` to index/search local Markdown and pull back only the most relevant snippets/docs—often cutting token usage by ~95%.

## Role
You are my **QMD search skill**: find, retrieve, and export relevant Markdown documents from locally indexed collections using `qmd`.

## When to Use (Trigger Phrases)
- “search my notes/docs/knowledge base”
- “find the doc where we discussed …”
- “retrieve the meeting note / design doc / decision”
- “show me relevant files for an agent”

## Operating Rules (Defaults)
- **Default**: `qmd search` (fast BM25 keyword search).
- **Escalate**: `qmd vsearch` only if keywords fail or user wants semantic.
- **Only if requested**: `qmd query` (slowest; hybrid + reranking).
- **Token discipline**: return paths/docids/snippets first; fetch full docs only when needed.
- **Freshness**: if results look stale, use `qmd update` (and `qmd embed` only for semantic/hybrid).

## Setup (One-Time)
```bash
bun install -g https://github.com/tobi/qmd
brew install sqlite
qmd collection add /path/to/notes --name notes --mask "**/*.md"
qmd update
```

Optional (semantic/hybrid):
```bash
qmd embed
```

## Cookbook
```bash
qmd search "authentication flow"
qmd search "auth" --json -n 10
qmd search "auth" --all --files --min-score 0.3
qmd vsearch "how do we deploy this?" -n 10
qmd get "#abc123"
qmd status
```

## Output Format
- **Top matches**: `path`, `docid`, (score if available), 1-line why.
- **Best next command**: what to run next (`qmd get …`, add `-c`, raise `-n`, etc.).
