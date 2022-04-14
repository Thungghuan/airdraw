<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { drawOnCanvas } from '../utils'

const canvasRef = ref<HTMLCanvasElement>()
let canvasContext: CanvasRenderingContext2D | undefined

onMounted(() => {
  const canvasEl = canvasRef.value!
  canvasEl.width = window.innerWidth * 2
  canvasEl.height = window.innerHeight * 2

  canvasContext = canvasEl.getContext('2d')!
})

if (import.meta.hot) {
  import.meta.hot.on('airdraw:display', ({ points }) => {
    drawOnCanvas(canvasContext!, points)
  })
}
</script>

<template>
  <div w-screen h-screen bg-gray font-mono select-none>
    <h1 absolute m0 left-5 top-3 text-gray-700>AirDraw - Display</h1>
    <canvas w-full h-full ref="canvasRef" />
  </div>
</template>
