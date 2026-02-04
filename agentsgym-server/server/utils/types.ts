export type SkillFrontmatter = {
  title: string;
  description: string;
  source?: string;
  categories: string[];
  author: string;
  githubUsername: string;
};

export type Skill = {
  id: string;
  path: string;
  frontmatter: SkillFrontmatter;
  content: string;
};

export type SearchHit = {
  id: string;
  title: string;
  description: string;
  source?: string;
  categories: string[];
  author: string;
  githubUsername: string;
  score: number;
  snippet?: string;
};

