import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // Относительный путь для корректной работы на GitHub Pages
  plugins: [react()],
}) 