<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { requestIdleCallback, drawOnCanvas } from './utils'
import { Point } from './types'

const displayX = ref(0)
const displayY = ref(0)

let isMousedown = false

const points: Point[] = []

const canvasRef = ref<HTMLCanvasElement>()
let canvasContext: CanvasRenderingContext2D | undefined

onMounted(() => {
  const canvasEl = canvasRef.value!
  canvasEl.width = window.innerWidth * 2
  canvasEl.height = window.innerHeight * 2

  canvasContext = canvasEl.getContext('2d')!
})

const handleMousePoint = (evt: TouchEvent | MouseEvent): Point => {
  let x, y
  if ('touches' in evt && evt.touches && evt.touches[0]) {
    x = evt.touches[0].pageX * 2
    y = evt.touches[0].pageY * 2
  } else {
    evt = evt as MouseEvent
    x = evt.pageX * 2
    y = evt.pageY * 2
  }

  displayX.value = x
  displayY.value = y

  return { x, y }
}

const onDrawStart = (evt: TouchEvent | MouseEvent) => {
  isMousedown = true
  const point = handleMousePoint(evt)

  points.push(point)
  drawOnCanvas(canvasContext!, points)
}

const onDrawMove = (evt: TouchEvent | MouseEvent) => {
  if (!isMousedown) return
  evt.preventDefault()

  const point = handleMousePoint(evt)
  points.push(point)
  if (points.length > 3) points.shift()

  drawOnCanvas(canvasContext!, points)
}

const onDrawEnd = () => {
  isMousedown = false
  requestIdleCallback(() => (points.length = 0))
}
</script>

<template>
  <div w-screen h-screen bg-gray font-mono select-none>
    <h1 absolute m0 left-5 top-3 text-gray-700>AirDraw</h1>
    <div absolute left-5 bottom-10>x: {{ displayX }}; y: {{ displayY }}</div>
    <canvas
      w-full
      h-full
      @touchstart="onDrawStart"
      @mousedown="onDrawStart"
      @touchmove="onDrawMove"
      @mousemove="onDrawMove"
      @touchend="onDrawEnd"
      @touchleave="onDrawEnd"
      @mouseup="onDrawEnd"
      ref="canvasRef"
    />
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
