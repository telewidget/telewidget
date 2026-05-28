import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'TeleWidget',
      fileName: (format) => `telewidget.${format}.js`,
      formats: ['iife', 'es'],
    },
    rollupOptions: {
      output: {
        // Ensure globals are set for IIFE if needed, 
        // but we'll bundle everything for the script tag.
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  }
})
