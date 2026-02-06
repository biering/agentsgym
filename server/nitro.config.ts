import { defineNitroConfig } from 'nitropack/config'
import { fileURLToPath } from 'node:url'

// https://nitro.build/config
export default defineNitroConfig({
  compatibilityDate: 'latest',
  srcDir: './server',
  preset: 'node_server',
  imports: {
    dirs: ['utils'],
  },
  experimental: {
    openAPI: true,
  },
  openAPI: {
    meta: {
      title: 'agentsgym API',
      description: 'agentsgym public API for skills',
      version: '1.0.0',
    },
    production: 'runtime',
    route: '/_openapi.json',
    ui: {
      scalar: {
        route: '/docs',
        theme: 'purple',
      },
      swagger: {
        route: '/swagger',
      },
    },
  },
  alias: {
    '~~': fileURLToPath(new URL('.', import.meta.url)),
    '#types': fileURLToPath(new URL('./shared/types', import.meta.url)),
  },
})
