# agentsgym

`agentsgym` is a small CLI (and optional Nitro server) to **serve and install OpenClaw-compatible skills**.

## CLI

List skills:

```bash
agentsgym index --base-url https://YOUR_HOST
```

Install a skill into `./skills/<slug>/SKILL.md`:

```bash
agentsgym install qmd --base-url https://YOUR_HOST
```

You can also set `AGENTSGYM_BASE_URL`:

```bash
AGENTSGYM_BASE_URL=https://YOUR_HOST agentsgym install qmd
```

## Server

The server exposes:

- `GET /api/skills/index`
- `GET /api/skills/openclaw-skill?slug=<slug>`
- `GET /api/skills/install-command?slug=<slug>`

