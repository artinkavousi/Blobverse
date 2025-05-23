import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: [
      // metadata files from package root
      { find: /^@blobverse\/([^\/]+)\/metadata\.json$/, replacement: path.resolve(__dirname, '../../packages/$1/metadata.json') },
      // nested imports: @blobverse/pkg/subpath
      { find: /^@blobverse\/([^\/]+)\/(.+)$/, replacement: path.resolve(__dirname, '../../packages/$1/src/$2') },
      // root imports: @blobverse/pkg
      { find: /^@blobverse\/([^\/]+)$/, replacement: path.resolve(__dirname, '../../packages/$1/src') }
    ],
    preserveSymlinks: true
  },
  esbuild: {
    loader: { '.frag': 'text', '.wgsl': 'text' }
  },
  server: {
    fs: { allow: ['../../packages'] }
  },
  // Allow raw imports of shader files
  assetsInclude: ['**/*.frag', '**/*.vert', '**/*.wgsl', '**/*.glsl']
})
