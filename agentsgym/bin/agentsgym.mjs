#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function usage(exitCode = 0) {
  const msg = `
agentsgym (CLI)

Install an OpenClaw skill into ./skills/<slug>/SKILL.md

Usage:
  agentsgym install <slug> --base-url <url> [--dir <path>]
  agentsgym index --base-url <url>

Examples:
  agentsgym index --base-url https://your-host
  agentsgym install qmd --base-url https://your-host
  AGENTSGYM_BASE_URL=https://your-host agentsgym install qmd
`.trim();
  process.stdout.write(msg + "\n");
  process.exit(exitCode);
}

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function requireBaseUrl() {
  const baseUrl = getArg("--base-url") ?? process.env.AGENTSGYM_BASE_URL;
  if (!baseUrl) {
    process.stderr.write("Missing --base-url (or AGENTSGYM_BASE_URL)\n");
    usage(2);
  }
  return baseUrl.replace(/\/+$/, "");
}

async function cmdIndex() {
  const baseUrl = requireBaseUrl();
  const res = await fetch(`${baseUrl}/api/skills/index`);
  if (!res.ok) {
    throw new Error(`Index fetch failed: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  process.stdout.write(JSON.stringify(json, null, 2) + "\n");
}

async function cmdInstall(slug) {
  const baseUrl = requireBaseUrl();
  const outDir = getArg("--dir") ?? process.cwd();
  const destDir = path.join(outDir, "skills", slug);
  const destFile = path.join(destDir, "SKILL.md");

  const url = `${baseUrl}/api/skills/openclaw-skill?slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Skill fetch failed: ${res.status} ${res.statusText}`);
  }
  const markdown = await res.text();

  await mkdir(destDir, { recursive: true });
  await writeFile(destFile, markdown, "utf8");
  process.stdout.write(destFile + "\n");
}

async function main() {
  const [,, cmd, arg1] = process.argv;
  if (!cmd || cmd === "-h" || cmd === "--help") usage(0);

  if (cmd === "index") return await cmdIndex();
  if (cmd === "install" && arg1) return await cmdInstall(arg1);

  usage(2);
}

main().catch((err) => {
  process.stderr.write((err?.stack ?? String(err)) + "\n");
  process.exit(1);
});

