import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server:{
<<<<<<< HEAD
    host:'10.0.0.253',
    port:3000,
    strictPort: true,
=======
    host: '10.0.0.253', // Your IP
    port:3000,
    strictPort: true
>>>>>>> 412fff6 (added syscodes logo)
  }
})
