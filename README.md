# agentsgym

This repo uses `skills/` as a simple **Markdown content CRM** for agent prompts (with strict YAML frontmatter). The goal is to keep prompts **diff-friendly**, **searchable**, and easy to remix across projects.

## Structure

- **`skills/`**: prompt notes (one prompt per `.md` file)
- **`template.md`**: the canonical prompt-note template (copy this when creating new prompts)
- **`categories.yaml`**: canonical list of allowed category slugs
- **`agentsgym/`**: npm package CLI (`npx agentsgym ...`)
- **`agentsgym-server/`**: Nitro (TypeScript) skills API server
- **`agentsgym-py/`**: Python client package (`pip install agentsgym-py`)

## Skills Service (self-hosted or hosted)

This repo includes a simple **skills registry API** that indexes Markdown skills from `skills/` and exposes:

- **Search**: `GET /search?q=...`
- **Fetch**: `GET /skills/{id}`
- **Categories**: `GET /categories`

### Why self-host?

The main benefit of self-hosting is **control**: you decide exactly which skills are accessible to your agents by controlling what lives in `skills/` (and which categories you publish in `categories.yaml`). This makes it easy to expose a curated/internal skill set while keeping everything else out of reach.

### Run the server (Nitro + TypeScript)

From the repo root:

```bash
cd agentsgym-server
npm install
npm run dev
```

Now you can hit:

- `http://127.0.0.1:8787/health`
- `http://127.0.0.1:8787/search?q=workspace`
- `http://127.0.0.1:8787/skills/ace-workspace-agent`

### Configure where skills are loaded from

- **`AGENTSGYM_CONTENT_DIR`**: directory containing `*.md` skills (defaults to `../content` when running in `agentsgym-server/`)
- **`AGENTSGYM_CATEGORIES_FILE`**: categories registry file (defaults to `../categories.yaml` when running in `agentsgym-server/`)

## npm CLI (search / fetch / install)

Use it without installing globally:

```bash
npx agentsgym search openclaw --base-url http://127.0.0.1:8787
npx agentsgym get ace-workspace-agent --base-url http://127.0.0.1:8787
npx agentsgym install ace-workspace-agent --base-url http://127.0.0.1:8787 --dest-dir ./installed-skills
```

## Python client (search / fetch / install) — `agentsgym-py`

### Install

```bash
uv pip install agentsgym-py
```

### Use

```python
from agentsgym_py.client import AgentsGymClient, ClientConfig

with AgentsGymClient(ClientConfig(base_url="http://127.0.0.1:8787")) as c:
    results = c.search("openclaw", limit=5)
    skill = c.get_skill(results.hits[0].id)
    c.install_skill(skill.id, dest_dir="./installed-skills")
```

## Metadata (required)

Every prompt note must start with YAML frontmatter using exactly these fields:

```yaml
---
title: string
description: string
source: string | null
categories: string[]
author: string
githubUsername: string
---
```

Then the rest of the file is the **prompt content**.

## Prompts

- Example: `skills/ace-workspace-agent.md`

## How to add a new prompt

If you're using GitHub in the browser, you can start a new prompt file directly here: [Create a new prompt in `skills/`](https://github.com/biering/agentsgym/new/main/skills)

1) Copy `template.md` → `skills/<your-prompt>.md`
2) Name the file **kebab-case** (stable names reduce churn in Git diffs)
3) Fill in frontmatter:
   - **`title`**: human-readable name
   - **`description`**: 1-2 sentences, indexable
   - **`categories`**: choose from `categories.yaml` (e.g. `["workspace","ops","openclaw"]`)
   - **`author`** / **`githubUsername`**: attribution
4) Paste the agent prompt below the frontmatter and keep headings stable

## Contributing

PRs are welcome. The bar is “easy to understand + easy to search + easy to diff.”

- **Frontmatter is mandatory**: all five fields must be present, with the correct types.
- **One prompt per file**: keep prompt content self-contained.
- **Keep it Git-friendly**:
  - Prefer stable filenames and headings
  - Avoid massive rewrites unless necessary
  - Don't add binaries (images, PDFs) unless there's a strong reason
- **Categories**: use `categories.yaml` and prefer a few broad categories over many overly-specific ones.
- **Attribution**: keep `author` / `githubUsername` accurate for new prompts or major rewrites.