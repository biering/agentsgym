import { getQuery } from 'h3'

import { getConfig } from '../utils/config'
import { search } from '../utils/search'
import { getStore } from '../utils/store'

export default defineEventHandler(async (event) => {
  const cfg = getConfig()
  const q = getQuery(event)

  const query = typeof q.q === 'string' ? q.q : ''
  const limit = typeof q.limit === 'string' ? Number.parseInt(q.limit, 10) : 10
  const offset = typeof q.offset === 'string' ? Number.parseInt(q.offset, 10) : 0

  const categoriesParam = q.category
  const categories =
    typeof categoriesParam === 'string'
      ? [categoriesParam]
      : Array.isArray(categoriesParam)
        ? (categoriesParam.filter((x) => typeof x === 'string') as string[])
        : undefined;

  const store = await getStore(cfg.contentDir, cfg.reloadEachRequest)
  const hits = search(Array.from(store.skillsById.values()), {
    query,
    limit: Number.isFinite(limit) ? Math.max(1, Math.min(50, limit)) : 10,
    offset: Number.isFinite(offset) ? Math.max(0, offset) : 0,
    categories,
  })

  return { query, count: hits.length, hits }
})

