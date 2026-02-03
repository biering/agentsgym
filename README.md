# agentsgym

This repo uses `content/` as a simple **Markdown content CRM** for agent prompts (with strict YAML frontmatter). The goal is to keep prompts **diff-friendly**, **searchable**, and easy to remix across projects.

## Structure

- **`content/`**: prompt notes (one prompt per `.md` file)
- **`template.md`**: the canonical prompt-note template (copy this when creating new prompts)

## Metadata (required)

Every prompt note must start with YAML frontmatter using exactly these fields:

```yaml
---
title: string
description: string
categories: string[]
author: string
githubUsername: string
---
```

Then the rest of the file is the **prompt content**.

## Prompts

- Example: `content/ace-workspace-agent.md`

## How to add a new prompt

1) Copy `template.md` → `content/<your-prompt>.md`
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