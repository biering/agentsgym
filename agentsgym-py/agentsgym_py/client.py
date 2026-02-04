from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import httpx

from agentsgym_py.markdown import dump_frontmatter
from agentsgym_py.models import SearchResponse, Skill


@dataclass(frozen=True)
class ClientConfig:
    base_url: str
    timeout_s: float = 30.0


class AgentsGymClient:
    def __init__(self, config: ClientConfig):
        self.config = config
        self._client = httpx.Client(base_url=config.base_url.rstrip("/"), timeout=config.timeout_s)

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> "AgentsGymClient":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        self.close()

    def health(self) -> dict[str, Any]:
        r = self._client.get("/health")
        r.raise_for_status()
        return r.json()

    def categories(self) -> dict[str, Any]:
        r = self._client.get("/categories")
        r.raise_for_status()
        return r.json()

    def search(self, query: str, *, limit: int = 10, offset: int = 0, categories: list[str] | None = None) -> SearchResponse:
        params: list[tuple[str, str]] = [("q", query), ("limit", str(limit)), ("offset", str(offset))]
        for c in categories or []:
            params.append(("category", c))
        r = self._client.get("/search", params=params)
        r.raise_for_status()
        return SearchResponse.model_validate(r.json())

    def get_skill(self, skill_id: str) -> Skill:
        r = self._client.get(f"/skills/{skill_id}")
        r.raise_for_status()
        return Skill.model_validate(r.json())

    def install_skill(self, skill_id: str, *, dest_dir: str | Path, filename: str | None = None) -> Path:
        skill = self.get_skill(skill_id)
        dest = Path(dest_dir)
        dest.mkdir(parents=True, exist_ok=True)
        out_path = dest / (filename or f"{skill.id}.md")

        fm = dump_frontmatter(skill.frontmatter.model_dump())
        out_path.write_text(fm + "\n" + skill.content.rstrip() + "\n", encoding="utf-8")
        return out_path

