import { getConfig } from '../utils/config'
import { loadCategoriesFile } from '../utils/store'

export default defineEventHandler(async () => {
  const cfg = getConfig()
  const categories = await loadCategoriesFile(cfg.categoriesFile)
  return { categories }
})

