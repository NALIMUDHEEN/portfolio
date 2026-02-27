"use client"

import { useEffect, useState } from "react"
import { api, PortfolioItem } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function AdminDashboard() {
    const [items, setItems] = useState<PortfolioItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setIsLoading(true)
        const portfolioData = await api.portfolio.list()
        setItems(portfolioData)
        setIsLoading(false)
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    const featuredCount = items.filter(item => item.isFeatured).length
    const hiddenCount = items.filter(item => item.isHidden).length

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Stats Cards */}
                <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col justify-between">
                    <h3 className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Projects</h3>
                    <p className="text-4xl md:text-5xl font-black mt-4">{items.length}</p>
                </div>

                <div className="bg-card p-6 rounded-xl border shadow-sm overflow-hidden relative flex flex-col justify-between">
                    <div className="relative z-10">
                        <h3 className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">Featured Works</h3>
                        <p className="text-4xl md:text-5xl font-black mt-4 text-primary">{featuredCount}</p>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col justify-between">
                    <h3 className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">Hidden Drafts</h3>
                    <p className="text-4xl md:text-5xl font-black mt-4">{hiddenCount}</p>
                </div>
            </div>
        </div>
    )
}
