import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  envPrefix: 'REACT_APP_',
  resolve: {
    alias: {
      process: 'process/browser',
      util: 'util',
    },
  },
  define: {
    'process.env': process.env,
    'global': 'globalThis'
  }
})
