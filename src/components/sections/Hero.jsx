import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useContentStore } from '../../store/contentStore'

function ParticleField(props) {
    const ref = useRef()
    const { viewport } = useThree()

    // State for dynamic gravity
    const simulationState = useRef({
        lastMouseX: 0,
        lastMouseY: 0,
        stationaryTime: 0
    })

    // Generate particles and store initial positions
    const [positions, colors, initialPositions, randomOffsets, types] = useMemo(() => {
        const count = 12000
        const positions = new Float32Array(count * 3)
        const initialPositions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const randomOffsets = new Float32Array(count * 3)
        const types = new Float32Array(count) // 0 = Background, 1 = Foreground

        const baseColor = new THREE.Color('#ffffff')

        for (let i = 0; i < count; i++) {
            // Spread across viewport
            const x = (Math.random() - 0.5) * viewport.width * 1.5
            const y = (Math.random() - 0.5) * viewport.height * 1.5
            const z = (Math.random() - 0.5) * 2

            positions[i * 3] = x
            positions[i * 3 + 1] = y
            positions[i * 3 + 2] = z

            initialPositions[i * 3] = x
            initialPositions[i * 3 + 1] = y
            initialPositions[i * 3 + 2] = z

            randomOffsets[i * 3] = Math.random() * Math.PI * 2
            randomOffsets[i * 3 + 1] = Math.random() * Math.PI * 2
            randomOffsets[i * 3 + 2] = Math.random() * Math.PI * 2

            colors[i * 3] = baseColor.r
            colors[i * 3 + 1] = baseColor.g
            colors[i * 3 + 2] = baseColor.b

            // 50/50 Split
            types[i] = Math.random() > 0.5 ? 1 : 0
        }
        return [positions, colors, initialPositions, randomOffsets, types]
    }, [viewport])

    useFrame((state, delta) => {
        if (ref.current) {
            const time = state.clock.getElapsedTime()

            // Mouse interaction
            const mouseX = state.pointer.x * (viewport.width / 2)
            const mouseY = state.pointer.y * (viewport.height / 2)

            // --- Dynamic Gravity Logic ---
            const distMoved = Math.sqrt(
                Math.pow(mouseX - simulationState.current.lastMouseX, 2) +
                Math.pow(mouseY - simulationState.current.lastMouseY, 2)
            )

            // If mouse moves significantly, reset gravity
            if (distMoved > 0.1) {
                simulationState.current.stationaryTime = 0
            } else {
                simulationState.current.stationaryTime += delta
            }

            simulationState.current.lastMouseX = mouseX
            simulationState.current.lastMouseY = mouseY

            // Ramp up gravity over 5 seconds (0 to 1)
            const gravityFactor = Math.min(1, simulationState.current.stationaryTime / 5.0)

            const positions = ref.current.geometry.attributes.position.array
            const colors = ref.current.geometry.attributes.color.array

            // Colors for Accretion Disk
            const colorCenter = new THREE.Color('#ffaa00') // Orange/Gold
            const colorOuter = new THREE.Color('#00F0FF') // Electric Blue
            const colorFar = new THREE.Color('#ffffff') // White

            // Influence radius covers the whole screen to ensure black hole always forms
            const influenceRadius = Math.max(viewport.width, viewport.height)
            const horizonRadius = 0.15
            const accretionDiskRadius = 1.5

            for (let i = 0; i < 12000; i++) {
                const i3 = i * 3
                const type = types[i]

                if (type === 0) {
                    // --- BACKGROUND LAYER (Star Field) ---
                    // Gentle drift instead of rotation to avoid "competing center" at (0,0)
                    const ix = initialPositions[i3]
                    const iy = initialPositions[i3 + 1]
                    const iz = initialPositions[i3 + 2]

                    // Subtle breathing/drift motion
                    positions[i3] = ix + Math.sin(time * 0.2 + ix) * 0.05
                    positions[i3 + 1] = iy + Math.cos(time * 0.3 + iy) * 0.05
                    positions[i3 + 2] = iz

                    colors[i3] = colorFar.r
                    colors[i3 + 1] = colorFar.g
                    colors[i3 + 2] = colorFar.b

                } else {
                    // --- FOREGROUND LAYER (Black Hole Physics) ---
                    const ix = initialPositions[i3]
                    const iy = initialPositions[i3 + 1]
                    const iz = initialPositions[i3 + 2]

                    const x = positions[i3]
                    const y = positions[i3 + 1]
                    const z = positions[i3 + 2]

                    // If mouse is moving (gravityFactor low), reset to initial
                    if (gravityFactor < 0.1) {
                        // Rapidly return to initial position
                        positions[i3] += (ix - x) * 0.2
                        positions[i3 + 1] += (iy - y) * 0.2
                        positions[i3 + 2] += (iz - z) * 0.2

                        // Reset colors
                        colors[i3] = colorFar.r
                        colors[i3 + 1] = colorFar.g
                        colors[i3 + 2] = colorFar.b

                        continue // Skip gravity logic
                    }

                    const dx = mouseX - x
                    const dy = mouseY - y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    const angle = Math.atan2(dy, dx)

                    if (dist < influenceRadius) {
                        // Gravity: Scaled by gravityFactor
                        const baseGravity = 0.005 * (1 - dist / influenceRadius) // Slightly stronger base gravity
                        const gravityStrength = baseGravity * gravityFactor

                        const pullX = Math.cos(angle) * gravityStrength
                        const pullY = Math.sin(angle) * gravityStrength

                        // Rotation: Also scaled slightly by gravityFactor to simulate "spinning up"
                        const baseRotation = 0.01 * (1 - dist / influenceRadius) + 0.0001
                        const rotationSpeed = baseRotation * (0.5 + 0.5 * gravityFactor)

                        const swirlX = -Math.sin(angle) * rotationSpeed
                        const swirlY = Math.cos(angle) * rotationSpeed

                        // Flatten
                        const flattenZ = (0 - z) * 0.1 * gravityFactor

                        positions[i3] += pullX + swirlX
                        positions[i3 + 1] += pullY + swirlY
                        positions[i3 + 2] += flattenZ

                        // Recycling
                        if (dist < horizonRadius) {
                            const angle = Math.random() * Math.PI * 2
                            const radius = influenceRadius * 0.1 + Math.random() * 0.5 // Respawn closer
                            positions[i3] = mouseX + Math.cos(angle) * radius
                            positions[i3 + 1] = mouseY + Math.sin(angle) * radius
                            positions[i3 + 2] = (Math.random() - 0.5) * 0.5
                        }

                        // Color Logic
                        let r, g, b
                        if (dist < accretionDiskRadius) {
                            const t = dist / accretionDiskRadius
                            r = THREE.MathUtils.lerp(colorCenter.r, colorOuter.r, t)
                            g = THREE.MathUtils.lerp(colorCenter.g, colorOuter.g, t)
                            b = THREE.MathUtils.lerp(colorCenter.b, colorOuter.b, t)
                        } else {
                            // Smooth fade out
                            const t = Math.min(1, (dist - accretionDiskRadius) / 2.0)
                            r = THREE.MathUtils.lerp(colorOuter.r, colorFar.r, t)
                            g = THREE.MathUtils.lerp(colorOuter.g, colorFar.g, t)
                            b = THREE.MathUtils.lerp(colorOuter.b, colorFar.b, t)
                        }

                        colors[i3] = r
                        colors[i3 + 1] = g
                        colors[i3 + 2] = b
                    } else {
                        // Should not happen with infinite radius, but safe fallback
                        positions[i3] += (ix - x) * 0.01
                        positions[i3 + 1] += (iy - y) * 0.01
                        positions[i3 + 2] += (iz - z) * 0.01

                        colors[i3] = colorFar.r
                        colors[i3 + 1] = colorFar.g
                        colors[i3 + 2] = colorFar.b
                    }
                }
            }

            ref.current.geometry.attributes.position.needsUpdate = true
            ref.current.geometry.attributes.color.needsUpdate = true
        }
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#fff"
                    size={0.003}
                    sizeAttenuation={true}
                    depthWrite={false}
                    vertexColors
                />
            </Points>
        </group>
    )
}

export default function Hero() {
    const { hero } = useContentStore()

    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden z-10 pointer-events-none">

            {/* 3D Particle Field */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <ParticleField />
                </Canvas>
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 text-center mix-blend-difference">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex justify-center items-center"
                >
                    <img
                        src="/Logo/hero-logo.png"
                        alt={hero.title}
                        className="w-[60vw] md:w-[40vw] h-auto object-contain filter invert"
                    />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-xl md:text-2xl font-mono mt-8 text-white"
                >
                    {hero.subtitle}
                </motion.p>
            </div>
        </section>
    )
}
