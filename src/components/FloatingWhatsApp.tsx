"use client"

import { useState } from "react"
import { MessageCircle, Send, Mail, X, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function FloatingWhatsApp() {
    const [isOpen, setIsOpen] = useState(false)

    // ---------------------------------------------------------
    // 📞 CONTACT CONFIGURATION
    // ---------------------------------------------------------
    const phoneNumber = "7907730393" // Your WhatsApp/Phone number
    const email = "nalimdheenwafy@gmail.com" // Your Email address

    const message = "Hi, I'm interested in working with you!"

    const staggerVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        visible: { opacity: 1, y: 0, scale: 1 }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col items-end gap-3 mb-2">
                        {/* Direct Call Pill */}
                        <motion.a
                            variants={staggerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ delay: 0.2 }}
                            href={`tel:+91${phoneNumber}`}
                            className="w-72 sm:w-80 bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-900 text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all flex items-center justify-between cursor-pointer"
                        >
                            <span className="font-semibold text-sm tracking-wide shrink-0">+91 {phoneNumber}</span>
                            <div className="bg-white/20 dark:bg-black/10 p-2 rounded-full shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                        </motion.a>

                        {/* Email Pill */}
                        <motion.a
                            variants={staggerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ delay: 0.1 }}
                            href={`mailto:${email}?subject=Work Inquiry&body=${encodeURIComponent(message)}`}
                            className="w-72 sm:w-80 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all flex items-center justify-between cursor-pointer"
                        >
                            <span className="font-semibold text-sm tracking-wide truncate pr-2">{email}</span>
                            <div className="bg-white/20 p-2 rounded-full shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                        </motion.a>

                        {/* WhatsApp Pill */}
                        <motion.a
                            variants={staggerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ delay: 0 }}
                            href={`https://wa.me/91${phoneNumber}?text=${encodeURIComponent(message)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-72 sm:w-80 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all flex items-center justify-between cursor-pointer"
                        >
                            <span className="font-semibold text-sm tracking-wide shrink-0">+91 {phoneNumber}</span>
                            <div className="bg-white/20 p-2 rounded-full shrink-0">
                                <MessageCircle className="w-5 h-5 fill-white" />
                            </div>
                        </motion.a>
                    </div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-6 py-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 flex items-center gap-3 group border border-primary-foreground/10"
                aria-label="Contact options"
            >
                <div className="relative">
                    {isOpen ? (
                        <X className="w-5 h-5 md:w-6 h-6" />
                    ) : (
                        <>
                            <MessageCircle className="w-5 h-5 md:w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-primary animate-pulse" />
                        </>
                    )}
                </div>
                <span className="font-black uppercase tracking-[0.15em] text-xs md:text-sm">
                    {isOpen ? "Close" : "Hire me"}
                </span>
                {!isOpen && (
                    <Send className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                )}
            </button>
        </div>
    )
}
