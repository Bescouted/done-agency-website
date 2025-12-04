import { useEffect } from 'react'
import Lenis from 'lenis'
import GridBackground from './GridBackground'
import CustomCursor from '../ui/CustomCursor'

export default function Layout({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        })

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])

    return (
        <div className="relative w-full min-h-screen bg-void-black text-white selection:bg-white selection:text-black cursor-none">
            <CustomCursor />
            <GridBackground />
            <main className="relative z-10">
                {children}
            </main>
        </div>
    )
}
