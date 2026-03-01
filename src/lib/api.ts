import { supabase } from './supabase'

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
    seoTitle: string
    metaDescription: string
    ogTitle: string
    ogDescription: string
    ogImage: string
    showLocalSEO: boolean
    localSEOContentEn: string
    localSEOContentMl: string
}

// Data Handling Service
export const api = {
    hero: {
        get: async (): Promise<HeroSettings> => {
            const defaults: HeroSettings = { textColor: "#0f172a", backgroundImage: null }
            const { data, error } = await supabase.from('hero_settings').select('*').eq('id', 1).single()

            if (error || !data) {
                return defaults
            }

            const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null))
            return { ...defaults, ...cleanData } as HeroSettings
        },
        update: async (settings: HeroSettings) => {
            const { error } = await supabase.from('hero_settings').update(settings).eq('id', 1)
            if (error) {
                console.error("Error updating hero settings:", error)
                return { success: false, error: error.message }
            }
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

            const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single()
            if (error || !data) {
                return defaults
            }

            const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null))
            return { ...defaults, ...cleanData } as unknown as SiteSettings
        },
        update: async (settings: SiteSettings) => {
            const { id, created_at, ...updatePayload } = settings as any;
            const { error } = await supabase.from('site_settings').update(updatePayload).eq('id', 1)
            if (error) {
                console.error("Error updating site settings:", error)
                return { success: false, error: error.message }
            }
            return { success: true }
        }
    },
    portfolio: {
        list: async (): Promise<PortfolioItem[]> => {
            const { data, error } = await supabase
                .from('portfolio')
                .select('*')
                .order('order', { ascending: true })

            if (error) {
                console.error("Error fetching portfolio:", error)
                return []
            }
            return data as PortfolioItem[]
        },
        create: async (item: Omit<PortfolioItem, 'id'>) => {
            // Get highest order to append to end
            const { data: currentItems } = await supabase.from('portfolio').select('order').order('order', { ascending: false }).limit(1)
            const newOrder = (currentItems && currentItems.length > 0) ? (currentItems[0].order + 1) : 0

            const { data, error } = await supabase
                .from('portfolio')
                .insert([{ ...item, order: newOrder }])
                .select()
                .single()

            if (error) {
                console.error("Error creating portfolio item:", error)
                return { success: false, error: error.message }
            }
            return { success: true, data: data as PortfolioItem }
        },
        update: async (item: PortfolioItem) => {
            // Strip out properties that shouldn't/can't be updated directly
            const { id, created_at, ...updatePayload } = item as any;

            const { error } = await supabase
                .from('portfolio')
                .update(updatePayload)
                .eq('id', item.id)

            if (error) {
                console.error("Error updating portfolio item:", error)
                return { success: false, error: error.message }
            }
            return { success: true, data: item }
        },
        delete: async (id: number) => {
            const { error } = await supabase
                .from('portfolio')
                .delete()
                .eq('id', id)

            if (error) {
                console.error("Error deleting portfolio item:", error)
                return { success: false, error: error.message }
            }
            return { success: true }
        },
        reorder: async (items: PortfolioItem[]) => {
            // Supabase doesn't have a bulk update out of the box in the JS client without RPC.
            // We will loop through and update them individually for this simple use case.
            let success = true
            for (const item of items) {
                const { error } = await supabase
                    .from('portfolio')
                    .update({ order: item.order })
                    .eq('id', item.id)
                if (error) {
                    console.error("Error reordering item", item.id, error)
                    success = false
                }
            }
            return { success }
        },
        clearAll: async () => {
            // Delete all where id is not null (deletes everything)
            const { error } = await supabase.from('portfolio').delete().neq('id', 0)
            if (error) {
                console.error("Error clearing portfolio:", error)
                return { success: false, error: error.message }
            }
            return { success: true }
        }
    },
    storage: {
        uploadImage: async (file: File): Promise<string> => {
            // Check file size (Limit to 5MB for base64 storage in DB)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error("File too large. Max 5MB allowed for database storage.")
            }

            // Converts file to Base64 for localized storage
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
