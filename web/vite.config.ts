import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub project pages: https://<user>.github.io/OpenT_Spacetime-Simulator/
// Local dev keeps base at "/".
const repoBase = '/OpenT_Spacetime-Simulator/'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? repoBase : '/',
  server: {
    port: 5173,
    open: false,
  },
}))
