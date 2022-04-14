<script setup lang="ts">
import { onMounted, ref } from 'vue'

let lineWidth = 0
let isMousedown = false
let points: any[] = []
const canvasRef = ref<HTMLCanvasElement>()

onMounted(() => {
  const canvasEl = canvasRef.value!
  canvasEl.width = window.innerWidth * 2
  canvasEl.height = window.innerHeight * 2

  const context = canvasEl.getContext('2d')!

  const strokeHistory: any[] = []

  const requestIdleCallback =
    window.requestIdleCallback ||
    function (fn: any) {
      setTimeout(fn, 1)
    }

  /**
   * This function takes in an array of points and draws them onto the canvasEl.
   * @param {array} stroke array of points to draw on the canvas
   * @return {void}
   */
  function drawOnCanvas(stroke: any[]) {
    context.strokeStyle = 'black'
    context.lineCap = 'round'
    context.lineJoin = 'round'

    const l = stroke.length - 1
    if (stroke.length >= 3) {
      const xc = (stroke[l].x + stroke[l - 1].x) / 2
      const yc = (stroke[l].y + stroke[l - 1].y) / 2
      context.lineWidth = stroke[l - 1].lineWidth
      context.quadraticCurveTo(stroke[l - 1].x, stroke[l - 1].y, xc, yc)
      context.stroke()
      context.beginPath()
      context.moveTo(xc, yc)
    } else {
      const point = stroke[l]
      context.lineWidth = point.lineWidth
      context.strokeStyle = point.color
      context.beginPath()
      context.moveTo(point.x, point.y)
      context.stroke()
    }
  }

  for (const ev of ['touchstart', 'mousedown']) {
    canvasEl.addEventListener(ev, function (e: any) {
      let pressure = 0.1
      let x, y
      if (
        e.touches &&
        e.touches[0] &&
        typeof e.touches[0]['force'] !== 'undefined'
      ) {
        if (e.touches[0]['force'] > 0) {
          pressure = e.touches[0]['force']
        }
        x = e.touches[0].pageX * 2
        y = e.touches[0].pageY * 2
      } else {
        pressure = 1.0
        x = e.pageX * 2
        y = e.pageY * 2
      }

      isMousedown = true

      lineWidth = Math.log(pressure + 1) * 40
      context.lineWidth = lineWidth // pressure * 50;

      points.push({ x, y, lineWidth })
      drawOnCanvas(points)
    })
  }

  for (const ev of ['touchmove', 'mousemove']) {
    canvasEl.addEventListener(ev, function (e: any) {
      if (!isMousedown) return
      e.preventDefault()

      let pressure = 0.1
      let x, y
      if (
        e.touches &&
        e.touches[0] &&
        typeof e.touches[0]['force'] !== 'undefined'
      ) {
        if (e.touches[0]['force'] > 0) {
          pressure = e.touches[0]['force']
        }
        x = e.touches[0].pageX * 2
        y = e.touches[0].pageY * 2
      } else {
        pressure = 1.0
        x = e.pageX * 2
        y = e.pageY * 2
      }

      // smoothen line width
      lineWidth = Math.log(pressure + 1) * 40 * 0.2 + lineWidth * 0.8
      points.push({ x, y, lineWidth })

      drawOnCanvas(points)

      requestIdleCallback(() => {
        // $force.textContent = 'force = ' + pressure
        // const touch = e.touches ? e.touches[0] : null
        // if (touch) {
        //   $touches.innerHTML = `
        //   touchType = ${touch.touchType} ${
        //     touch.touchType === 'direct' ? '👆' : '✍️'
        //   } <br/>
        //   radiusX = ${touch.radiusX} <br/>
        //   radiusY = ${touch.radiusY} <br/>
        //   rotationAngle = ${touch.rotationAngle} <br/>
        //   altitudeAngle = ${touch.altitudeAngle} <br/>
        //   azimuthAngle = ${touch.azimuthAngle} <br/>
        // `
        // }
      })
    })
  }

  for (const ev of ['touchend', 'touchleave', 'mouseup']) {
    canvasEl.addEventListener(ev, function (e: any) {
      let pressure = 0.1
      let x, y

      if (
        e.touches &&
        e.touches[0] &&
        typeof e.touches[0]['force'] !== 'undefined'
      ) {
        if (e.touches[0]['force'] > 0) {
          pressure = e.touches[0]['force']
        }
        x = e.touches[0].pageX * 2
        y = e.touches[0].pageY * 2
      } else {
        pressure = 1.0
        x = e.pageX * 2
        y = e.pageY * 2
      }

      isMousedown = false

      requestIdleCallback(function () {
        strokeHistory.push([...points])
        points = []
      })

      lineWidth = 0
    })
  }
})
</script>

<template>
  <div w-screen h-screen bg-gray font-mono select-none>
    <h1 absolute m0 left-5 top-3 text-gray-700>AirDraw</h1>
    <canvas w-full h-full ref="canvasRef" />
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
