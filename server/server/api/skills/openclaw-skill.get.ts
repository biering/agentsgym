import { getQuery, setHeader } from "h3";
import { readSkillMarkdown } from "../../utils/skills";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const slug = String(query.slug ?? "");
  const markdown = await readSkillMarkdown(slug);

  setHeader(event, "content-type", "text/markdown; charset=utf-8");
  // Let the installer use cached responses (CDN-friendly)
  setHeader(event, "cache-control", "public, max-age=60");

  return markdown;
});

