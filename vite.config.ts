import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const pathSrc = path.resolve(__dirname, 'src')
// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '~/': `${pathSrc}/`,
    },
  },
  plugins: [
    vue(), 
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        })
      ],
      dts: 'src/type/components.d.ts',
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`
      }
    }
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('element-plus')) return 'element'
          if (id.includes('node_modules')) return 'vendor'
        }
      }
    }
  }
})


