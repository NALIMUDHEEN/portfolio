"use client"

import Link from "next/link"
import { LayoutDashboard, Image, Settings, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        // Skip check on login page
        if (pathname === "/admin/login") {
            setAuthorized(true)
            return
        }

        const token = localStorage.getItem("admin_token")
        if (!token) {
            router.push("/admin/login")
        } else {
            setAuthorized(true)
        }
    }, [pathname, router])

    const handleLogout = () => {
        localStorage.removeItem("admin_token")
        router.push("/admin/login")
    }

    // Don't render layout elements on login page
    if (pathname === "/admin/login") {
        return <>{children}</>
    }

    if (!authorized) return null

    return (
        <div className="min-h-screen flex bg-secondary/20">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border min-h-screen p-6 flex flex-col fixed h-full z-10">
                <div className="mb-8">
                    <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Portfolio Admin
                    </h1>
                </div>

                <nav className="space-y-2 flex-1">
                    <Link href="/admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${pathname === '/admin/dashboard' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/portfolio" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${pathname === '/admin/portfolio' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                        <Image className="w-5 h-5" />
                        Portfolio
                    </Link>
                    <Link href="/admin/hero" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${pathname === '/admin/hero' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                        <Image className="w-5 h-5" />
                        Hero Settings
                    </Link>
                    <Link href="/admin/seo" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${pathname === '/admin/seo' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                        <Settings className="w-5 h-5" />
                        SEO Settings
                    </Link>
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors mt-auto w-full font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto ml-64">
                {children}
            </main>
        </div>
    )
}
