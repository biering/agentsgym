import { createError, getRouterParam } from 'h3'

import { getConfig } from '../../utils/config'
import { getStore } from '../../utils/store'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing skill id' })
  }

  const cfg = getConfig()
  const store = await getStore(cfg.contentDir, cfg.reloadEachRequest)
  const skill = store.skillsById.get(id)
  if (!skill) {
    throw createError({ statusCode: 404, statusMessage: `Skill not found: ${id}` })
  }
  return skill
})

