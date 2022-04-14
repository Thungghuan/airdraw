import { Point } from './types'

// polyfill `requestIdleCallback`
export const requestIdleCallback =
  window.requestIdleCallback ||
  function (fn: Function) {
    setTimeout(fn, 1)
  }

export function drawOnCanvas(
  context: CanvasRenderingContext2D,
  points: Point[]
) {
  context.strokeStyle = 'black'
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.lineWidth = 10

  if (points.length === 3) {
    const xc = (points[2].x + points[1].x) / 2
    const yc = (points[2].y + points[1].y) / 2
    context.quadraticCurveTo(points[1].x, points[1].y, xc, yc)
    context.stroke()
    context.beginPath()
    context.moveTo(xc, yc)
  } else {
    const point = points[points.length - 1]
    context.beginPath()
    context.moveTo(point.x, point.y)
    context.stroke()
  }
}

export const handleMousePoint = (evt: TouchEvent | MouseEvent): Point => {
  let x, y
  if ('touches' in evt && evt.touches && evt.touches[0]) {
    x = evt.touches[0].pageX * 2
    y = evt.touches[0].pageY * 2
  } else {
    evt = evt as MouseEvent
    x = evt.pageX * 2
    y = evt.pageY * 2
  }

  return { x, y }
}
