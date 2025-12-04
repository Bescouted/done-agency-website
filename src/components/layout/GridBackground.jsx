import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'

export default function GridBackground() {
    const containerRef = useRef(null)
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY])

    // Grid configuration
    const gridSize = 50 // px

    // Dynamic mask for the highlight layer
    const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`

    return (
        <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-void-black">
            {/* Base Grid (Low Opacity) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 flex justify-between" style={{ gap: `${gridSize}px` }}>
                    {Array.from({ length: 100 }).map((_, i) => (
                        <div key={`v-${i}`} className="h-full w-[1px] bg-white opacity-[0.03]" />
                    ))}
                </div>
                <div className="absolute inset-0 flex flex-col justify-between" style={{ gap: `${gridSize}px` }}>
                    {Array.from({ length: 100 }).map((_, i) => (
                        <div key={`h-${i}`} className="w-full h-[1px] bg-white opacity-[0.03]" />
                    ))}
                </div>
            </div>

            {/* Highlight Grid (Higher Opacity, Masked) */}
            <motion.div
                className="absolute inset-0 z-10"
                style={{
                    maskImage,
                    WebkitMaskImage: maskImage
                }}
            >
                {/* We need to update the mask position based on mouseX/mouseY. 
                    However, useMotionValue in style prop for maskImage might not work directly with template strings dynamically.
                    Let's use a motion value for the background or a separate div that follows.
                    Actually, the previous "Interactive Cursor Follower" was a glowing orb.
                    Let's use a mask on a container of brighter lines.
                */}
                <div className="absolute inset-0 flex justify-between" style={{ gap: `${gridSize}px` }}>
                    {Array.from({ length: 100 }).map((_, i) => (
                        <div key={`v-high-${i}`} className="h-full w-[1px] bg-electric-blue opacity-20" />
                    ))}
                </div>
                <div className="absolute inset-0 flex flex-col justify-between" style={{ gap: `${gridSize}px` }}>
                    {Array.from({ length: 100 }).map((_, i) => (
                        <div key={`h-high-${i}`} className="w-full h-[1px] bg-electric-blue opacity-20" />
                    ))}
                </div>
            </motion.div>

            {/* Subtle Glow */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full bg-electric-blue mix-blend-screen blur-[120px] opacity-10"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: '-50%',
                    translateY: '-50%'
                }}
            />
        </div>
    )
}
