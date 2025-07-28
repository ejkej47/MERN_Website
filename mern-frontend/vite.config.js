import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Učitaj .env fajlove prema režimu (development, production itd.)
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],
    server: {
      port: 5173,
    },
    // Ako želiš dodatne definicije možeš ih ovde dodati, npr:
    // define: {
    //   __SOME_GLOBAL__: JSON.stringify('value'),
    // },
  };
});
