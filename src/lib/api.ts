import { supabase, mockPortfolio } from './supabase'

// Types
export interface PortfolioItem {
    id: number
    title: string
    category: string
    image: string
    description: string
    order: number
    isFeatured: boolean
    isHidden: boolean
    slug: string
    tools: string[]
    images: string[] // Gallery
    videoUrl?: string
    seoTitle?: string
    seoDescription?: string
    altText?: string
    titleAttribute?: string
}

export interface HeroSettings {
    textColor: string
    backgroundImage: string | null
}

export interface SiteSettings {
    featuredTitle: string
    visualTitle: string
    showFeatured: boolean
    showVisual: boolean
    // SEO Settings
    seoTitle: string
    metaDescription: string
    ogTitle: string
    ogDescription: string
    ogImage: string
    // Local SEO Section
    showLocalSEO: boolean
    localSEOContentEn: string
    localSEOContentMl: string
}

const STORAGE_KEYS = {
    PORTFOLIO: 'portfolio_items_v1',
    HERO: 'hero_settings_v1',
    SETTINGS: 'site_settings_v1'
}

// Data Handling Service
export const api = {
    hero: {
        get: async (): Promise<HeroSettings> => {
            if (typeof window === 'undefined') return { textColor: "#0f172a", backgroundImage: null }

            const stored = localStorage.getItem(STORAGE_KEYS.HERO)
            if (stored) return JSON.parse(stored)

            return {
                textColor: "#0f172a",
                backgroundImage: null
            }
        },
        update: async (settings: HeroSettings) => {
            localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(settings))
            return { success: true }
        }
    },
    settings: {
        get: async (): Promise<SiteSettings> => {
            const defaults: SiteSettings = {
                featuredTitle: "Selected Projects",
                visualTitle: "Visual Works",
                showFeatured: true,
                showVisual: true,
                seoTitle: "Nalimudheen",
                metaDescription: "Professional Graphic Designer, Photographer and Videographer in Kerala specializing in branding, videography/editing, motion graphics and institutional media coordination.",
                ogTitle: "Nalimudheen - Portfolio",
                ogDescription: "Digital portfolio of Nalimudheen, a visual storyteller based in Kerala.",
                ogImage: "",
                showLocalSEO: true,
                localSEOContentEn: "I provide professional graphic design, photography, videography, branding, and social media management services for educational institutions and businesses across Kerala.",
                localSEOContentMl: "കേരളത്തിൽ വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾക്കും ബിസിനസുകൾക്കും വേണ്ടിയുള്ള ഗ്രാഫിക് ഡിസൈൻ, ഫോട്ടോഗ്രഫി, വീഡിയോ ഗ്രാഫി, ബ്രാൻഡിംഗ്, സോഷ്യൽ മീഡിയ മാനേജ്മെന്റ് സേവനങ്ങൾ ഞാൻ നൽകുന്നു."
            }

            if (typeof window === 'undefined') return defaults

            const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
            if (stored) return { ...defaults, ...JSON.parse(stored) }

            return defaults
        },
        update: async (settings: SiteSettings) => {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
            return { success: true }
        }
    },
    portfolio: {
        list: async (): Promise<PortfolioItem[]> => {
            if (typeof window === 'undefined') return []

            return new Promise((resolve) => {
                const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO)
                if (stored) {
                    setTimeout(() => resolve(JSON.parse(stored)), 300) // Simulate network
                    return
                }

                // Initial Seed - Empty for production
                const seedItems: PortfolioItem[] = []

                // Save empty seed to storage
                localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(seedItems))
                setTimeout(() => resolve(seedItems), 300)
            })
        },
        create: async (item: Omit<PortfolioItem, 'id'>) => {
            try {
                const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO)
                const items: PortfolioItem[] = stored ? JSON.parse(stored) : []

                const newItem = {
                    ...item,
                    id: Date.now() // Simple ID generation
                }

                const updatedItems = [newItem, ...items]
                localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(updatedItems))
                return { success: true, data: newItem }
            } catch (error) {
                console.error("Storage Error:", error)
                return { success: false, error: "Storage full. Please delete items or use smaller images." }
            }
        },
        update: async (item: PortfolioItem) => {
            try {
                const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO)
                if (!stored) return { success: false }

                const items: PortfolioItem[] = JSON.parse(stored)
                const updatedItems = items.map(i => i.id === item.id ? item : i)

                localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(updatedItems))
                return { success: true }
            } catch (error) {
                return { success: false, error: "Storage full." }
            }
        },
        delete: async (id: number) => {
            try {
                const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIO)
                if (!stored) return { success: false }

                const items: PortfolioItem[] = JSON.parse(stored)
                const updatedItems = items.filter(i => i.id !== id)

                localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(updatedItems))
                return { success: true }
            } catch (error) {
                return { success: false, error: "Failed to delete item." }
            }
        },
        reorder: async (items: PortfolioItem[]) => {
            localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(items))
            return { success: true }
        },
        clearAll: async () => {
            localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify([]))
            return { success: true }
        }
    },
    storage: {
        uploadImage: async (file: File): Promise<string> => {
            // Check file size (Limit to 5MB for localStorage)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error("File too large. Max 5MB allowed for local browser storage.")
            }

            // Converts file to Base64 for localized storage (Not recommended for prod but perfect for this demo)
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result as string)
                reader.onerror = reject
                reader.readAsDataURL(file)
            })
        }
    },
    utils: {
        getYouTubeThumbnail: (url: string): string | null => {
            const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?\/]*).*/;
            const match = url.match(regExp);
            const videoId = (match && match[1].length === 11) ? match[1] : null;
            if (videoId) {
                return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }
            return null;
        }
    }
}
