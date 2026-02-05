import { getQuery, setHeader } from "h3";
import { assertValidSlug } from "../../utils/skills";

function getBaseUrlFromRequest(event: any): string {
  const req = event?.node?.req;
  const headers = req?.headers ?? {};
  const proto = (headers["x-forwarded-proto"] as string | undefined) ?? "http";
  const host = (headers["x-forwarded-host"] as string | undefined) ?? (headers.host as string | undefined) ?? "localhost";
  return `${proto}://${host}`;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const slug = String(query.slug ?? "");
  assertValidSlug(slug);

  const baseUrl = getBaseUrlFromRequest(event);
  const url = `${baseUrl}/api/skills/openclaw-skill?slug=${encodeURIComponent(slug)}`;

  const cmd = `mkdir -p "./skills/${slug}" && curl -fsSL "${url}" -o "./skills/${slug}/SKILL.md"`;

  setHeader(event, "content-type", "text/plain; charset=utf-8");
  return cmd + "\n";
});

