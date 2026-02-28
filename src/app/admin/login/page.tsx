"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // Simple mock auth for demonstration
        // In a real app, this would hit an API endpoint
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (email === "admin@nalimdheen.com" && password === "admin123") {
            // Set session token
            localStorage.setItem("admin_token", "demo_token_secure_123")
            router.push("/admin/dashboard")
        } else {
            setError("Invalid credentials. Please try again.")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl relative overflow-hidden"
            >
                {/* Decorative header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
                    <p className="text-muted-foreground text-sm mt-2">Sign in to manage your portfolio</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your admin email"
                            className="w-full px-4 py-3 rounded-lg border border-border bg-secondary/30 focus:bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-lg border border-border bg-secondary/30 focus:bg-background focus:ring-2 ring-primary/20 outline-none transition-all pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Access Dashboard <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-muted-foreground">
                        Default Credentials: <br />
                        <span className="font-mono bg-secondary px-1 rounded">admin@nalimdheen.com</span> / <span className="font-mono bg-secondary px-1 rounded">admin123</span>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
