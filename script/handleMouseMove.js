const PARAMS = Object.freeze({
  pointsNumber: 20,
  widthFactor: 0.3,
  mouseThreshold: 0.6,
  spring: 0.8,
  friction: 0.5,
})

const canvasEl = document.getElementById("fuckginCanvas")
canvasEl.width = window.innerWidth
canvasEl.height = window.innerHeight

const cnvContext = canvasEl.getContext("2d")
cnvContext.strokeStyle = "black"
cnvContext.lineWidth = 3

export const Mouse = {
  x: null,
  y: null,
  path: Array.from({ length: PARAMS.pointsNumber }, () => ({
    x: null,
    y: null,
    dx: 0,
    dy: 0,
  })),
}

export const animate = (time) => {
  cnvContext.clearRect(0, 0, canvasEl.width, canvasEl.height)

  if (Mouse.x && Mouse.y) {
    Mouse.path.forEach((point, pointIndex) => {
      const prevPoint =
        pointIndex === 0
          ? {
              x: Mouse.x,
              y: Mouse.y,
              dx: 0,
              dy: 0,
            }
          : Mouse.path[pointIndex - 1]
      const spring = pointIndex === 0 ? 0.4 * PARAMS.spring : PARAMS.spring

      point.dx = (prevPoint.x - point.x) * spring * PARAMS.friction
      point.dy = (prevPoint.y - point.y) * spring * PARAMS.friction

      point.x += point.dx
      point.y += point.dy

      if (pointIndex === 0) {
        cnvContext.lineCap = "round"
        // start the line on the first point
        cnvContext.beginPath()
        cnvContext.moveTo(Mouse.x, Mouse.y)
      } else {
        // continue with new line segment to the following one
        cnvContext.lineTo(point.x, point.y)
        cnvContext.lineWidth =
          PARAMS.widthFactor * (PARAMS.pointsNumber - pointIndex)
      }
    })

    cnvContext.stroke()
  }

  window.requestAnimationFrame(animate)
}

export const handleMouseMove = (e) => {
  if (!Mouse.x && !Mouse.y) {
    Mouse.path.forEach((p, ind) => {
      p.x = e.offsetX
      p.y = e.offsetY
    })
  }

  Mouse.x = e.offsetX
  Mouse.y = e.offsetY
}
