from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class SkillFrontmatter(BaseModel):
    title: str
    description: str
    source: str | None = None
    categories: list[str] = Field(default_factory=list)
    author: str
    githubUsername: str


class Skill(BaseModel):
    id: str
    path: str
    frontmatter: SkillFrontmatter
    content: str


class SearchHit(BaseModel):
    id: str
    title: str
    description: str
    source: str | None = None
    categories: list[str]
    author: str
    githubUsername: str
    score: float
    snippet: str | None = None


class SearchResponse(BaseModel):
    query: str
    count: int
    hits: list[SearchHit]


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"


class ErrorResponse(BaseModel):
    error: str
    details: dict[str, Any] | None = None

