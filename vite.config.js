import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Serves the /api/* functions (same files Vercel deploys) during `npm run dev`.
function apiRoutes() {
  return {
    name: 'rahhala-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        const { default: handler } = await server.ssrLoadModule('/api/chat.js');
        await handler(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Make ANTHROPIC_API_KEY from .env available to the dev API (never exposed to the browser:
  // only VITE_* variables reach client code).
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    plugins: [react(), apiRoutes()],
    server: { port: 5173, open: true },
  };
});
