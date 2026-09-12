import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Vite configuration for CarbonLoop operations app shell
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
