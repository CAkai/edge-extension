import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc'

// 这里 import manifest.json 文件
import manifest from './manifest.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
})
