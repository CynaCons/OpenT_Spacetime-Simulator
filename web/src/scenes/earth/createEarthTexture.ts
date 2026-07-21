import { CanvasTexture, SRGBColorSpace } from 'three'

/** Procedural Earth-like texture (no external assets). */
export function createEarthTexture(size = 1024): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    const tex = new CanvasTexture(canvas)
    return tex
  }

  // Ocean base
  const ocean = ctx.createLinearGradient(0, 0, size, size)
  ocean.addColorStop(0, '#0a3d6b')
  ocean.addColorStop(0.5, '#0c4a7a')
  ocean.addColorStop(1, '#082f54')
  ctx.fillStyle = ocean
  ctx.fillRect(0, 0, size, size)

  // Soft continent blobs (stylized, not geographic accuracy)
  const landPatches: Array<[number, number, number, string]> = [
    [0.22, 0.35, 0.14, '#2f7d4a'],
    [0.28, 0.48, 0.1, '#3a8f55'],
    [0.55, 0.32, 0.16, '#4a8f3a'],
    [0.62, 0.45, 0.12, '#5a9a42'],
    [0.48, 0.55, 0.09, '#6b8f3a'],
    [0.75, 0.6, 0.11, '#3d7a48'],
    [0.18, 0.62, 0.08, '#8a7a3a'],
    [0.4, 0.22, 0.07, '#cfd8dc'],
    [0.7, 0.2, 0.08, '#eceff1'],
  ]

  for (const [ux, uy, r, color] of landPatches) {
    const x = ux * size
    const y = uy * size
    const rad = r * size
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad)
    g.addColorStop(0, color)
    g.addColorStop(0.7, color)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(x, y, rad * 1.3, rad, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // Cloud wisps
  ctx.globalAlpha = 0.18
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = (0.02 + Math.random() * 0.06) * size
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.ellipse(x, y, r * 2, r * 0.6, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // Grid-ish equator hint
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, size * 0.5)
  ctx.lineTo(size, size * 0.5)
  ctx.stroke()

  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

export function createFlatMapTexture(size = 1024): CanvasTexture {
  // Same map stretched onto disk — intentional for comparison
  return createEarthTexture(size)
}
