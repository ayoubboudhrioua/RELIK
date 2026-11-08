import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'
import { en } from '../../content/en.js'
import styles from './NoSignal.module.css'

const W = 160
const H = 90
const FPS = 12

// One frame of warm, grey static.
function drawNoise(ctx) {
  const frame = ctx.createImageData(W, H)
  const px = frame.data
  for (let i = 0; i < px.length; i += 4) {
    const v = Math.random() * 255
    px[i] = v
    px[i + 1] = v 
    px[i + 2] = v
    px[i + 3] = 255
  }
  ctx.putImageData(frame, 0, 0)
}

// The TV picture when the search finds nothing: test-pattern bars, snow, a rolling band.
export function NoSignal({ className = '' }) {
  const reducedMotion = useReducedMotion()
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    drawNoise(ctx)
    if (reducedMotion) return
    let id
    let last = 0
    const loop = (now) => {
      if (now - last > 1000 / FPS) {
        drawNoise(ctx)
        last = now
      }
      id = requestAnimationFrame(loop)
    }
    id = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(id)
  }, [reducedMotion])

  return (
    <div className={`${styles.root} ${className}`} aria-hidden="true">
      <div className={styles.bars} />
      <canvas ref={canvasRef} width={W} height={H} className={styles.noise} />
      <span className={styles.band} />
      <p className={styles.plate} data-text={en.home.hero.noSignal}>
        {en.home.hero.noSignal}
      </p>
    </div>
  )
}