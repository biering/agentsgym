from __future__ import annotations

from dataclasses import dataclass

import yaml


@dataclass(frozen=True)
class ParsedMarkdown:
    frontmatter: dict
    content: str


def parse_frontmatter(markdown_text: str) -> ParsedMarkdown:
    """
    Parse YAML frontmatter of the form:

    ---
    key: value
    ---

    ...content...
    """
    text = markdown_text.lstrip("\ufeff")
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return ParsedMarkdown(frontmatter={}, content=markdown_text)

    end_idx = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end_idx = i
            break

    if end_idx is None:
        return ParsedMarkdown(frontmatter={}, content=markdown_text)

    fm_text = "\n".join(lines[1:end_idx]).strip()
    content = "\n".join(lines[end_idx + 1 :]).lstrip("\n")
    try:
        fm = yaml.safe_load(fm_text) if fm_text else {}
    except Exception:
        fm = {}

    if not isinstance(fm, dict):
        fm = {}

    return ParsedMarkdown(frontmatter=fm, content=content)


def dump_frontmatter(frontmatter: dict) -> str:
    fm_text = yaml.safe_dump(frontmatter, sort_keys=False).strip()
    return f"---\n{fm_text}\n---\n"

