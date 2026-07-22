import { Html } from '@react-three/drei'
import type { CSSProperties, ReactNode } from 'react'
import { useSimulation } from '../../state/simulationStore'

/**
 * The only text allowed inside the 3D viewport: a one-line name chip.
 * Longer prose belongs in the lab console or the chapter panel.
 * Respects the global Labels toggle; kept under the HUD in stacking order.
 */
export function SceneLabel({
  position,
  color = '#9eb2d4',
  children,
  distanceFactor = 16,
  style,
}: {
  position: [number, number, number]
  color?: string
  children: ReactNode
  distanceFactor?: number
  style?: CSSProperties
}) {
  const show = useSimulation((s) => s.showLabels)
  if (!show) return null

  return (
    <Html
      position={position}
      center
      distanceFactor={distanceFactor}
      zIndexRange={[2, 0]}
      style={{ pointerEvents: 'none' }}
    >
      <div
        style={{
          color,
          fontSize: 11,
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
          fontWeight: 500,
          letterSpacing: '0.01em',
          textShadow: '0 1px 4px #000',
          background: '#0a1220b8',
          padding: '2px 8px',
          borderRadius: 999,
          border: `1px solid ${color}40`,
          ...style,
        }}
      >
        {children}
      </div>
    </Html>
  )
}
