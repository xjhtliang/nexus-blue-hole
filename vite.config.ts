import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false, // Disable sourcemaps for production
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor splitting
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot', 'lucide-react'],
          'data-vendor': ['@tanstack/react-query', '@tanstack/react-table', 'recharts', 'dayjs', 'zod'],
          'editor-vendor': ['@tiptap/react', '@tiptap/starter-kit'],
          'dnd-vendor': ['@dnd-kit/core', '@dnd-kit/sortable'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
});