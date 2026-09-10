import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/vibecoded-portfolio/',
  build: { outDir: 'dist', assetsDir: 'assets' },
  server: { fs: { strict: false } },
})
