import { defineConfig, createLogger } from 'vite'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { presetUno, presetAttributify } from 'unocss'
import AirDrawPlugin from './plugin'

// https://vitejs.dev/config/
export default defineConfig({
  customLogger: createLogger('info', { prefix: 'airdraw' }),
  server: {
    port: 3333,
    host: true
  },
  plugins: [
    AirDrawPlugin(),
    Vue(),
    UnoCSS({
      presets: [presetUno(), presetAttributify()]
    })
  ]
})
