"use client"

import { useState, useEffect } from "react"
import { api, SiteSettings } from "@/lib/api"
import { Check, Settings, Eye, EyeOff, Globe, Image as ImageIcon, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SEOAdmin() {
    const [settings, setSettings] = useState<SiteSettings | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    useEffect(() => {
        async function load() {
            const data = await api.settings.get()
            setSettings(data)
            setLoading(false)
        }
        load()
    }, [])

    const handleSave = async () => {
        if (!settings) return
        setIsSaving(true)
        await api.settings.update(settings)
        setIsSaving(false)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
    }

    if (loading || !settings) {
        return <div className="p-12 text-center text-muted-foreground">Loading SEO Settings...</div>
    }

    return (
        <div className="p-8 max-w-5xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">SEO & Identity</h1>
                    <p className="text-muted-foreground">Optimize your search visibility and local rankings in Kerala</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : saveSuccess ? (
                        <>
                            <Check className="w-5 h-5" />
                            Saved Successfully
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5" />
                            Save SEO Settings
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Meta Tags Section */}
                <div className="space-y-8">
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            Global Meta Tags
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Homepage SEO Title</label>
                                <input
                                    type="text"
                                    value={settings.seoTitle}
                                    onChange={e => setSettings({ ...settings, seoTitle: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    placeholder="e.g. Nalimudheen Wafy | Graphic Designer & Media Coordinator in Kerala"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Meta Description (Target 155-160 chars)</label>
                                <textarea
                                    value={settings.metaDescription}
                                    onChange={e => setSettings({ ...settings, metaDescription: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all h-24 resize-none"
                                    placeholder="Brief summary of your services for Google search results..."
                                />
                                <div className="text-[10px] text-right text-muted-foreground">
                                    {settings.metaDescription.length} characters
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            Social Share (Open Graph)
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">OG Title</label>
                                <input
                                    type="text"
                                    value={settings.ogTitle}
                                    onChange={e => setSettings({ ...settings, ogTitle: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">OG Description</label>
                                <textarea
                                    value={settings.ogDescription}
                                    onChange={e => setSettings({ ...settings, ogDescription: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all h-20 resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">OG Image URL</label>
                                <input
                                    type="text"
                                    value={settings.ogImage}
                                    onChange={e => setSettings({ ...settings, ogImage: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    placeholder="https://yourdomain.com/og-image.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Invisible SEO Content Section */}
                <div className="space-y-8">
                    <div className="bg-card rounded-2xl border border-primary/20 p-6 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Invisible SEO Content (Kerala)
                            </h3>
                            <button
                                onClick={() => setSettings({ ...settings, showLocalSEO: !settings.showLocalSEO })}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold uppercase tracking-tighter",
                                    settings.showLocalSEO ? "bg-primary/10 border-primary text-primary" : "bg-muted border-border text-muted-foreground"
                                )}
                            >
                                {settings.showLocalSEO ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                {settings.showLocalSEO ? "SEO Data Active" : "SEO Data Hidden"}
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Keywords (English)</label>
                                <textarea
                                    value={settings.localSEOContentEn}
                                    onChange={e => setSettings({ ...settings, localSEOContentEn: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all h-28 resize-none text-sm"
                                    placeholder="English paragraph describing your services in Kerala..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Service Keywords (Malayalam)</label>
                                <textarea
                                    value={settings.localSEOContentMl}
                                    onChange={e => setSettings({ ...settings, localSEOContentMl: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all h-28 resize-none text-sm font-medium"
                                    placeholder="Malayalam paragraph describing your services in Kerala..."
                                />
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Status: Invisible to Users</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                This content is rendered as hidden semantic HTML. It helps you rank for local keywords without affecting your website's clean, photography-focused design.
                            </p>
                        </div>
                    </div>

                    <div className="bg-card rounded-2xl border border-border border-dashed p-8 text-center">
                        <Settings className="w-10 h-10 mx-auto mb-4 opacity-20" />
                        <h4 className="font-bold mb-2">More SEO Tools Coming</h4>
                        <p className="text-sm text-muted-foreground">
                            Sitemap auto-generation and robots.txt <br />
                            management are handled automatically.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
