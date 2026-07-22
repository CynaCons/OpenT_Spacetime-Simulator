import { Stars } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'

/**
 * Shared look: tone mapping, fog, fill lights, optional starfield.
 * Drop into any lab scene for consistent cinematic depth.
 */
export function SceneAtmosphere({
  background = '#050814',
  fogNear = 40,
  fogFar = 120,
  stars = true,
  starCount = 3500,
}: {
  background?: string
  fogNear?: number
  fogFar?: number
  stars?: boolean
  starCount?: number
}) {
  const { gl } = useThree()

  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping
    gl.toneMappingExposure = 1.08
    gl.outputColorSpace = SRGBColorSpace
  }, [gl])

  return (
    <>
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[background, fogNear, fogFar]} />
      <ambientLight intensity={0.24} color="#a8c0ff" />
      <hemisphereLight args={['#9bb7ff', '#0a0e18', 0.48]} />
      <directionalLight position={[12, 18, 8]} intensity={0.6} color="#fff2d6" />
      {stars && (
        <Stars
          radius={180}
          depth={70}
          count={starCount}
          factor={3.2}
          saturation={0}
          fade
          speed={0.4}
        />
      )}
    </>
  )
}
