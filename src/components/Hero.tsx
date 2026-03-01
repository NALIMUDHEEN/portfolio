"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BackgroundAnimation from "./BackgroundAnimation"
import { api } from "@/lib/api"

const roles = [
    "Graphic Designer",
    "Video Editor",
    "Motion Graphics Designer",
    "Photographer",
    "Videographer",
    "Social Media Handler",
]

export default function Hero() {
    const [index, setIndex] = useState(0)
    const [displayText, setDisplayText] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const [typingSpeed, setTypingSpeed] = useState(150)
    const [settings, setSettings] = useState({ textColor: "#0f172a", backgroundImage: null as string | null })

    useEffect(() => {
        async function load() {
            try {
                const data = await api.hero.get()
                setSettings(data)
            } catch (error) {
                console.error("Failed to load hero settings", error)
            }
        }
        load()
    }, [])

    useEffect(() => {
        const handleTyping = () => {
            const currentRole = roles[index]
            const isFinishedTyping = !isDeleting && displayText === currentRole
            const isFinishedDeleting = isDeleting && displayText === ""

            if (isFinishedTyping) {
                // Pause at the end of typing
                setTimeout(() => setIsDeleting(true), 2000)
                return
            }

            if (isFinishedDeleting) {
                setIsDeleting(false)
                setIndex((prev) => (prev + 1) % roles.length)
                return
            }

            const nextText = isDeleting
                ? currentRole.substring(0, displayText.length - 1)
                : currentRole.substring(0, displayText.length + 1)

            setDisplayText(nextText)
            setTypingSpeed(isDeleting ? 70 : 120)
        }

        const timer = setTimeout(handleTyping, typingSpeed)
        return () => clearTimeout(timer)
    }, [displayText, isDeleting, index, typingSpeed])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            }
        }
    }

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1] as any // Cubic-bezier for a more "expensive" feel
            }
        }
    }

    const floatingAnimation: any = {
        y: [0, -10, 0],
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }

    return (
        <section
            className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden transition-colors duration-700 text-foreground"
            style={{
                color: settings.backgroundImage ? settings.textColor : undefined,
                backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Background elements are handled by BackgroundAnimation, but we add a dark overlay if a BG image exists */}
            {settings.backgroundImage && (
                <div className="absolute inset-0 bg-black/20 z-0" />
            )}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container px-4 md:px-6 flex flex-col items-center text-center z-10 pb-40 md:pb-20"
            >
                <div className="overflow-hidden mb-4">
                    <motion.h2
                        variants={itemVariants}
                        className="text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.3em] sm:tracking-[0.5em] uppercase opacity-60 mb-2 mx-auto max-w-[90vw]"
                    >
                        8 Years of designing experience
                    </motion.h2>
                </div>

                <div className="overflow-hidden pb-4 w-full">
                    <motion.div
                        variants={itemVariants}
                        animate={floatingAnimation}
                    >
                        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4 select-none drop-shadow-sm leading-[0.9] w-full mx-auto uppercase break-words sm:break-normal">
                            Nalimudheen
                        </h1>
                    </motion.div>
                </div>

                <motion.div
                    variants={itemVariants}
                    className="h-16 md:h-20 flex flex-col items-center justify-center gap-1"
                >
                    <span className="text-lg md:text-xl font-light opacity-60">Professional</span>
                    <div className="text-3xl md:text-5xl font-semibold tracking-tight italic min-h-[1.2em] flex items-center">
                        <span>{displayText}</span>
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "steps(2)" as any }}
                            className="inline-block w-[3px] h-[0.7em] bg-primary ml-1"
                        />
                    </div>
                </motion.div>

                {/* Static hidden text for SEO */}
                <div className="sr-only">
                    <h1>Nalimudheen Wafy – Graphic Designer, Photographer and Media Coordinator in Kerala</h1>
                    {roles.map((role) => (
                        <span key={role}>I'm a {role}. </span>
                    ))}
                    <p>Professional Graphic Designer and Visual Media Specialist based in Malappuram, Kerala.</p>
                </div>

                {/* Subtle Scroll Indicator */}
                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { delay: 2, duration: 1.5 } }
                    }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                >
                    <span className="text-[10px] uppercase tracking-[0.6em] font-medium opacity-30">Scroll Down</span>
                    <div className="relative w-[2px] h-24 bg-foreground/5 overflow-hidden">
                        <motion.div
                            animate={{ y: [-96, 96] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent"
                        />
                    </div>
                </motion.div>
            </motion.div>

            <BackgroundAnimation />
        </section>
    )
}
