import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { transform } from 'esbuild'

export default defineConfig({
  plugins: [
    {
      name: 'jsx-in-js',
      async transform(code, id) {
        if (id.endsWith('.js') && code.includes('</')) {
          const result = await transform(code, {
            loader: 'jsx',
            jsx: 'automatic',
            jsxImportSource: 'react'
          })
          return result.code
        }
      }
    },
    react()
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  }
})
