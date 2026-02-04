export default defineNitroConfig({
  srcDir: '.',
  preset: 'node-server',
  devServer: {
    host: '127.0.0.1',
    port: 8787,
  },
  routeRules: {
    '/health': { cors: true },
    '/categories': { cors: true },
    '/search': { cors: true },
    '/skills/**': { cors: true },
  },
})
