# agentsgym

This repo is a small **Markdown prompt/skills catalog**. The goal is to keep prompts **diff-friendly**, **searchable**, and easy to remix across projects—while keeping skill prompts **OpenClaw-compatible**.

## Structure

- **`skills/`**: reusable skills (one skill per folder)
  - `skills/<skill-slug>/SKILL.md`: the skill prompt (**OpenClaw-compatible** frontmatter + prompt)
  - `skills/<skill-slug>/README.md`: short human-facing overview + quick start
- **`template/`**: templates for new skills

## Metadata (required for skills)

Every skill prompt must start with YAML frontmatter using at least these fields (OpenClaw-compatible):

```yaml
---
name: string
description: string
metadata: {"agentsgym":{...}}  # single-line JSON; put extra fields here
---
```

Then the rest of the file is the **prompt content**. For maximum OpenClaw compatibility, **avoid multi-line YAML structures** in frontmatter (store them inside `metadata` as single-line JSON instead).

## How to add a new skill

1) Copy `template/SKILL.md` → `skills/<skill-slug>/SKILL.md`
2) Name the folder **kebab-case** (stable names reduce churn in Git diffs)
3) Fill in frontmatter:
   - **`name`**: stable skill key (usually the slug)
   - **`description`**: 1-2 sentences, indexable
   - **`metadata`**: store `title`, `categories`, attribution, links, etc. as single-line JSON under `metadata.agentsgym`
4) Paste the skill prompt below the frontmatter and keep headings stable

## Contributing

PRs are welcome. The bar is “easy to understand + easy to search + easy to diff.”

- **Frontmatter is mandatory**: `name` and `description` must be present; extra fields go in `metadata` as single-line JSON.
- **One prompt per file**: keep prompt content self-contained.
- **Keep it Git-friendly**:
  - Prefer stable filenames and headings
  - Avoid massive rewrites unless necessary
  - Don't add binaries (images, PDFs) unless there's a strong reason
- **Categories/Attribution** (recommended): store in `metadata.agentsgym.categories`, `metadata.agentsgym.author`, `metadata.agentsgym.githubUsername`.