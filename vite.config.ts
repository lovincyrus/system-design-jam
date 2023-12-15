import { defineConfig, loadEnv } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default ({ mode }) => {
  // See: https://stackoverflow.com/questions/70709987/how-to-load-environment-variables-from-env-file-using-vite
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    root: './ui-src',
    plugins: [reactRefresh(), viteSingleFile()],
    build: {
      target: 'esnext',
      assetsInlineLimit: 100000000,
      chunkSizeWarningLimit: 100000000,
      cssCodeSplit: false,
      outDir: '../dist',
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  })
}
