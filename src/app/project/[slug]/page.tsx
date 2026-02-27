"use client"

import { useState, useEffect } from "react"
import { api, PortfolioItem } from "@/lib/api"
import { notFound, useRouter } from "next/navigation"
import { Tag, Hammer, ChevronLeft, ExternalLink, Play } from "lucide-react"
import Link from "next/link"

export default function ProjectPage({ params }: { params: { slug: string } }) {
    const [project, setProject] = useState<PortfolioItem | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function load() {
            const items = await api.portfolio.list()
            const found = items.find(i => i.slug === params.slug)
            if (!found && !loading) {
                // We'll give it a moment to load from storage
            }
            setProject(found || null)
            setLoading(false)
        }
        load()
    }, [params.slug])

    const [hasEnded, setHasEnded] = useState(false)

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== "https://www.youtube.com") return
            try {
                const data = JSON.parse(event.data)
                if (data.event === "infoDelivery" && data.info && data.info.playerState === 0) {
                    setHasEnded(true)
                }
            } catch (e) { }
        }
        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [])

    const getEmbedUrl = (url: string) => {
        if (!url) return "";
        const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?\/]*).*/;
        const match = url.match(regExp);
        const videoId = (match && match[1].length === 11) ? match[1] : null;

        if (videoId) {
            // Added enablejsapi=1, rel=0, modestbranding=1, and iv_load_policy=3
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&mute=0&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`;
        }
        return url;
    };

    if (loading) {
        // ... rest of loading logic
    }

    if (!project) return notFound()

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 md:py-24 max-w-6xl">
                <Link
                    href="/#portfolio"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>

                <div className="flex flex-col gap-12">
                    {/* Media Header */}
                    <div className="aspect-video w-full bg-black rounded-[2rem] overflow-hidden shadow-2xl relative group">
                        {project.videoUrl && !hasEnded ? (
                            <iframe
                                src={getEmbedUrl(project.videoUrl)}
                                className="w-full h-full border-none"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer" onClick={() => setHasEnded(false)}>
                                <img src={project.image} className="w-full h-full object-contain" alt={project.title} />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Tag className="w-3 h-3" />
                                    {project.category}
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">{project.title}</h1>
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {project.description}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            {project.tools && project.tools.length > 0 && (
                                <div className="p-8 bg-secondary/30 rounded-3xl border border-border">
                                    <h5 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-muted-foreground">
                                        <Hammer className="w-4 h-4" />
                                        Tools Used
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tools.map(tool => (
                                            <span key={tool} className="px-4 py-2 bg-background rounded-xl text-xs font-bold border border-border shadow-sm">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.images && project.images.length > 0 && (
                                <div className="space-y-6">
                                    <h5 className="text-sm font-bold uppercase tracking-widest px-2 text-muted-foreground">Project Gallery</h5>
                                    <div className="grid grid-cols-1 gap-4">
                                        {project.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                className="w-full rounded-2xl border border-border hover:shadow-xl transition-all"
                                                alt={`${project.title} sequence ${i + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
