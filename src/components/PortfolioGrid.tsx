"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { api, PortfolioItem } from "@/lib/api"
import { X, ExternalLink, Play, Tag, ArrowLeft, ArrowRight, Eye, MapPin } from "lucide-react"

// Categories (Matches requirements)
const categories = [
    "All",
    "Graphic Design",
    "Videography/Editing",
    "Motion Graphics",
    "Photography",

    "Social Media",
    "Website",
]

export default function PortfolioGrid() {
    const [items, setItems] = useState<PortfolioItem[]>([])
    const [settings, setSettings] = useState({
        featuredTitle: "Selected Projects",
        visualTitle: "Visual Works",
        showFeatured: true,
        showVisual: true,
        seoTitle: "",
        metaDescription: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        showLocalSEO: false,
        localSEOContentEn: "",
        localSEOContentMl: ""
    })
    const [activeCategory, setActiveCategory] = useState("All")
    const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [visibleCount, setVisibleCount] = useState(12)

    const handleNext = () => {
        if (!selectedProject) return
        const currentIndex = filteredItems.findIndex(i => i.id === selectedProject.id)
        const nextIndex = (currentIndex + 1) % filteredItems.length
        setSelectedProject(filteredItems[nextIndex])
    }

    const handlePrev = () => {
        if (!selectedProject) return
        const currentIndex = filteredItems.findIndex(i => i.id === selectedProject.id)
        const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length
        setSelectedProject(filteredItems[prevIndex])
    }

    useEffect(() => {
        setVisibleCount(12)
    }, [activeCategory])

    useEffect(() => {
        async function load() {
            try {
                const [data, siteSettings] = await Promise.all([
                    api.portfolio.list(),
                    api.settings.get()
                ])
                setItems(data)
                setSettings(siteSettings)
            } catch (err) {
                console.error("Failed to load portfolio items", err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const filteredItems = items.filter(item => {
        const matchesCategory = activeCategory === "All" || item.category === activeCategory
        return matchesCategory && !item.isHidden
    })

    const featuredItems = filteredItems.filter(item => item.isFeatured)
    const gridItems = filteredItems.filter(item => !item.isFeatured)

    if (loading) {
        return <div className="py-24 text-center">Loading Portfolio...</div>
    }

    return (
        <section className="py-24 px-4 md:px-6 bg-background" id="portfolio">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.3em] mb-4">Portfolio</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Hybrid Showcase</h3>
                </motion.div>

                {/* Filter System */}
                <div className="flex justify-start md:justify-center gap-2 mb-16 overflow-x-auto pb-4 no-scrollbar w-full">
                    <div className="flex gap-2 p-1 bg-secondary/50 backdrop-blur-sm rounded-full border border-border min-w-max mx-auto md:mx-0">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-4 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap",
                                    activeCategory === cat
                                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 1. Featured Projects Section */}
                {settings.showFeatured && featuredItems.length > 0 && (
                    <div className="mb-24">
                        <div className="flex items-center gap-4 mb-10">
                            <h4 className="text-2xl font-bold whitespace-nowrap">{settings.featuredTitle}</h4>
                            <div className="h-[1px] w-full bg-border" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <AnimatePresence mode="popLayout">
                                {featuredItems.map((item) => (
                                    <FeaturedCard
                                        key={item.id}
                                        item={item}
                                        onClick={() => setSelectedProject(item)}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* 2. Structured SEO Content (Hidden from UI, visible to search engines) */}
                {settings.showLocalSEO && (
                    <div className="sr-only">
                        <section>
                            <h2>Media Services in Kerala</h2>
                            <p>Nalimudheen Wafy provides graphic design, photography, videography, branding, and social media management services across Kerala.</p>
                            <div>
                                <p>{settings.localSEOContentEn}</p>
                                <p lang="ml">{settings.localSEOContentMl}</p>
                            </div>
                        </section>
                    </div>
                )}

                {/* 3. Instagram-style Visual Grid Section */}
                {settings.showVisual && gridItems.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-center gap-4 mb-10 px-4">
                            <h4 className="text-2xl font-bold whitespace-nowrap">{settings.visualTitle}</h4>
                            <div className="h-[1px] w-full bg-border/50" />
                        </div>
                        <motion.div
                            layout
                            className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2"
                        >
                            <AnimatePresence mode="popLayout">
                                {gridItems.slice(0, visibleCount).map((item) => (
                                    <VisualGridItem
                                        key={item.id}
                                        item={item}
                                        onClick={() => setSelectedProject(item)}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {gridItems.length > 12 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-12 flex justify-center gap-4"
                            >
                                {gridItems.length > visibleCount ? (
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + 12)}
                                        className="px-10 py-4 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-bold tracking-tight shadow-sm hover:shadow-xl hover:-translate-y-1"
                                    >
                                        Show More Works
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setVisibleCount(12)}
                                        className="px-10 py-4 rounded-full bg-secondary/50 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold tracking-tight shadow-sm hover:shadow-xl hover:-translate-y-1"
                                    >
                                        Show Less
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </div>
                )}
            </div>

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        items={filteredItems}
                        initialIndex={filteredItems.findIndex(i => i.id === selectedProject.id)}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    )
}

function FeaturedCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="group relative overflow-hidden rounded-3xl bg-card border border-border shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
            onClick={onClick}
        >
            <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                    src={item.image}
                    alt={item.altText || `${item.title} ${item.category} Kerala`}
                    title={item.titleAttribute || item.title}
                    className={cn(
                        "w-full h-full object-cover object-center transition-transform duration-1000",
                        item.videoUrl ? "scale-[1.2] group-hover:scale-[1.25]" : "group-hover:scale-105"
                    )}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    {/* Icons removed as per request to keep clean UI */}
                </div>
            </div>
            <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-primary text-xs font-bold uppercase tracking-widest">{item.category}</span>
                </div>
                <h4 className="text-2xl font-bold mb-3">{item.title}</h4>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-6">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                    {item.tools?.slice(0, 3).map(tool => (
                        <span key={tool} className="text-[10px] px-2 py-1 bg-secondary rounded-md text-secondary-foreground font-medium">{tool}</span>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

function VisualGridItem({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative aspect-square cursor-pointer group bg-muted overflow-hidden"
            onClick={onClick}
        >
            <img
                src={item.image}
                alt={item.altText || `${item.title} ${item.category} Kerala`}
                title={item.titleAttribute || item.title}
                className={cn(
                    "w-full h-full object-cover object-center transition-all duration-700 grayscale-[0.2] md:grayscale-[0.4] group-hover:grayscale-0",
                    item.videoUrl ? "scale-[1.2] group-hover:scale-[1.25]" : "group-hover:scale-105"
                )}
                loading="lazy"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 md:bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-center p-4">
                <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center">
                    <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-2">{item.category}</p>
                    <p className="text-white font-medium text-xs md:text-sm px-2 leading-tight">{item.title}</p>
                    {/* Icons removed as per request to keep clean UI */}
                </div>
            </div>
        </motion.div>
    )
}

function ProjectModal({ items, initialIndex, onClose }: {
    items: PortfolioItem[];
    initialIndex: number;
    onClose: () => void;
}) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [isMobile, setIsMobile] = useState(false)
    const project = items[currentIndex]

    const onNext = () => setCurrentIndex(prev => (prev + 1) % items.length)
    const onPrev = () => setCurrentIndex(prev => (prev - 1 + items.length) % items.length)

    useEffect(() => {
        // Lock background scroll
        document.body.style.overflow = 'hidden'

        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") onNext()
            if (e.key === "ArrowLeft") onPrev()
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            document.body.style.overflow = 'unset'
            window.removeEventListener('resize', checkMobile)
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [onNext, onPrev, onClose])

    // Auto-scroll to initial item on mobile
    useEffect(() => {
        if (!isMobile) return
        const timer = setTimeout(() => {
            const el = document.getElementById(`feed-item-${items[initialIndex].id}`)
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
        return () => clearTimeout(timer)
    }, [isMobile])

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/95 backdrop-blur-xl"
            />

            {/* Close Button - Global */}
            <button
                onClick={onClose}
                className="fixed right-6 top-6 z-50 p-2 bg-secondary/80 backdrop-blur-md rounded-full hover:bg-secondary transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            {/* DESKTOP VIEW (Carousel) - Only render if not mobile */}
            {!isMobile && (
                <div className="hidden md:flex relative w-full h-full items-center justify-center p-8 pointer-events-none">
                    {/* Navigation Buttons */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-10 pointer-events-none z-20">
                        <button
                            onClick={(e) => { e.stopPropagation(); onPrev(); }}
                            className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all pointer-events-auto group shadow-lg"
                        >
                            <ArrowLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onNext(); }}
                            className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all pointer-events-auto group shadow-lg"
                        >
                            <ArrowRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-6xl max-h-[92vh] bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col z-10 pointer-events-auto"
                    >
                        <ProjectContent project={project} autoPlay={true} />
                    </motion.div>
                </div>
            )}

            {/* MOBILE VIEW (Vertical Feed) - Only render if mobile */}
            {isMobile && (
                <div className="md:hidden fixed inset-0 z-10 overflow-y-auto no-scrollbar pt-20 px-4 pb-24">
                    <div className="flex flex-col gap-12">
                        {items.map((item) => (
                            <div key={item.id} id={`feed-item-${item.id}`} className="w-full bg-card border border-border rounded-[2rem] overflow-hidden shadow-xl">
                                <ProjectContent project={item} autoPlay={item.id === items[initialIndex].id} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function ProjectContent({ project, autoPlay = false }: { project: PortfolioItem; autoPlay?: boolean }) {
    const [hasEnded, setHasEnded] = useState(false)
    const iframeRef = useState<string>(Math.random().toString(36).substring(7))[0]

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
            return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&showinfo=0&mute=0&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`;
        }
        return url;
    };

    return (
        <div className="overflow-y-auto no-scrollbar">
            {/* Media Display */}
            <div className="w-full bg-black/5 relative group/media flex items-center justify-center min-h-[300px]">
                {project.videoUrl && !hasEnded ? (
                    <div className="aspect-video w-full">
                        <iframe
                            id={iframeRef}
                            src={getEmbedUrl(project.videoUrl)}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden aspect-video cursor-pointer" onClick={() => setHasEnded(false)}>
                        <img
                            src={project.image}
                            className="w-full h-full object-contain transition-all duration-700"
                            alt={project.altText || `${project.title} ${project.category} Kerala`}
                            title={project.titleAttribute || project.title}
                        />
                    </div>
                )}
                {/* External link removed as per request */}
            </div>

            <div className="p-8 md:p-16">
                <div className="flex flex-col md:flex-row gap-12 md:gap-16">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Tag className="w-3.5 h-3.5" />
                                {project.category}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-6xl font-bold mb-6 md:mb-8 tracking-tighter text-foreground leading-tight">{project.title}</h2>
                        <p className="text-sm md:text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap mb-10">
                            {project.description}
                        </p>

                        {project.tools && project.tools.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {project.tools.map(tool => (
                                    <span key={tool} className="px-3 py-1.5 md:px-4 md:py-2 bg-secondary/50 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold border border-border/50 text-foreground/70">
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
