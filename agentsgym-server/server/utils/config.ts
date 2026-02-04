import path from 'node:path'

export type ServerConfig = {
  contentDir: string;
  categoriesFile: string;
  reloadEachRequest: boolean;
};

export function getConfig(): ServerConfig {
  const cwd = process.cwd()
  return {
    contentDir:
      process.env.AGENTSGYM_CONTENT_DIR ??
      path.resolve(cwd, '..', 'content'),
    categoriesFile:
      process.env.AGENTSGYM_CATEGORIES_FILE ??
      path.resolve(cwd, '..', 'categories.yaml'),
    reloadEachRequest: process.env.AGENTSGYM_RELOAD_EACH_REQUEST === '1',
  }
}

