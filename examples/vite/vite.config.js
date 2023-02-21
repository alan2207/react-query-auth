import { defineConfig } from 'vite';
import ReactPlugin from 'vite-preset-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ReactPlugin({
      injectReact: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
