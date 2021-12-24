import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  /*
  envPrefix: 'REACT_APP_',
  build: {
    outDir: './build',
    sourcemap: true,
    manifest: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  */
  define: {
    'process.env': process.env,
  },
})
