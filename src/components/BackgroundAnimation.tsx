"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function BackgroundAnimation() {
    const [mounted, setMounted] = useState(false)
    const [particles, setParticles] = useState<any[]>([])

    useEffect(() => {
        setMounted(true)
        // Generate random particles on client side to avoid hydration mismatch
        const newParticles = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            size: Math.random() * 4 + 1,
            x: Math.random() * 100,
            y: Math.random() * 100,
            duration: Math.random() * 20 + 20,
            delay: Math.random() * -20,
        }))
        setParticles(newParticles)
    }, [])

    if (!mounted) return null

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
            {/* Base Background - Keeps it clean */}
            <div className="absolute inset-0 bg-white dark:bg-[#020617]" />

            {/* Very Subtle Dot Grid */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Ambient Auras - Antigravity Style */}
            <motion.div
                animate={{
                    x: [0, 30, -30, 0],
                    y: [0, -30, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[10%] left-[15%] w-[50%] h-[50%] rounded-full bg-primary/3 blur-[120px]"
            />

            <motion.div
                animate={{
                    x: [0, -40, 40, 0],
                    y: [0, 40, -40, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[5%] right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/3 blur-[150px] dark:bg-blue-400/5"
            />

            {/* Floating "Antigravity" Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 0.2, 0],
                        y: ["0%", "-100%"],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear",
                    }}
                    style={{
                        position: "absolute",
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        borderRadius: "50%",
                        backgroundColor: "currentColor",
                        filter: "blur(1px)",
                    }}
                    className="text-primary/20"
                />
            ))}

            {/* Subtle Horizontal Light Streak */}
            <div className="absolute top-[45%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-30" />
        </div>
    )
}
