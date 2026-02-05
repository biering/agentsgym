import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function assertValidSlug(slug: string): void {
  if (!SLUG_RE.test(slug)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid slug",
    });
  }
}

export function repoRoot(): string {
  const explicit = process.env.AGENTSGYM_REPO_ROOT;
  if (explicit) return explicit;

  // Support running the Nitro app from `server/` while the `skills/` folder
  // lives at the repo root (sibling of `server/`).
  const cwd = process.cwd();
  const candidates = [cwd, path.resolve(cwd, "..")];
  for (const candidate of candidates) {
    if (existsSync(path.join(candidate, "skills", "index.json"))) return candidate;
  }
  return cwd;
}

export async function readSkillMarkdown(slug: string): Promise<string> {
  assertValidSlug(slug);
  const filePath = path.join(repoRoot(), "skills", slug, "SKILL.md");
  try {
    return await readFile(filePath, "utf8");
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      throw createError({ statusCode: 404, statusMessage: "Skill not found" });
    }
    throw err;
  }
}

export async function readSkillsIndex(): Promise<unknown> {
  const filePath = path.join(repoRoot(), "skills", "index.json");
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      throw createError({ statusCode: 404, statusMessage: "Index not found" });
    }
    throw err;
  }
}

