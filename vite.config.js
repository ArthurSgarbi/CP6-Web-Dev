import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest } from './server/localApi.js';

export default defineConfig(({ mode }) => {
  // These values stay in Node.js; only VITE_ variables reach the browser.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  const target = process.env.API_PROXY_TARGET;
  return {
    plugins: [react(), {
      name: 'portfolio-local-api',
      apply: 'serve',
      configureServer(server) {
        if (target) return;
        server.middlewares.use((req, res, next) => {
          if (!req.url?.split('?')[0].startsWith('/api/')) return next();
          return handleApiRequest(req, res);
        });
      },
    }],
    server: {
      proxy: target ? { '/api': { target, changeOrigin: false } } : undefined,
    },
  };
});
