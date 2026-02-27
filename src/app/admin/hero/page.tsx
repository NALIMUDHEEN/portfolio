"use client"

import { useState, useEffect } from "react"
import { api, HeroSettings } from "@/lib/api"
import { Save, Image as ImageIcon, Plus } from "lucide-react"

export default function HeroAdmin() {
    const [settings, setSettings] = useState<HeroSettings>({
        textColor: "#0f172a",
        backgroundImage: null
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function load() {
            const data = await api.hero.get()
            setSettings(data)
            setLoading(false)
        }
        load()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        await api.hero.update(settings)
        setSaving(false)
        alert("Hero settings saved!")
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Hero Section Settings</h1>

            <div className="space-y-6 bg-card p-6 rounded-xl border border-border shadow-sm">
                {/* Text Color Control */}
                <div>
                    <label className="block text-sm font-medium mb-2">Primary Text Color</label>
                    <div className="flex gap-4 items-center">
                        <input
                            type="color"
                            value={settings.textColor}
                            onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                            className="w-12 h-12 rounded cursor-pointer border-none shadow-sm"
                        />
                        <input
                            type="text"
                            value={settings.textColor}
                            onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                            className="flex-1 px-4 py-2 rounded-lg border border-border bg-background font-mono"
                        />
                    </div>
                </div>

                {/* Background Image Control */}
                <div>
                    <label className="block text-sm font-medium mb-2">Background Image</label>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <ImageIcon className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Image URL (optional)"
                                    value={settings.backgroundImage || ''}
                                    onChange={(e) => setSettings({ ...settings, backgroundImage: e.target.value || null })}
                                    className="w-full pl-11 pr-4 py-2 rounded-lg border border-border bg-background"
                                />
                            </div>
                        </div>

                        <div className="relative pt-2">
                            <input
                                type="file"
                                id="image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        const url = await api.storage.uploadImage(file)
                                        setSettings({ ...settings, backgroundImage: url })
                                    }
                                }}
                            />
                            <label
                                htmlFor="image-upload"
                                className="flex items-center justify-center gap-2 w-full py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-primary"
                            >
                                <Plus className="w-4 h-4" />
                                Upload Image from Computer
                            </label>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Upload an image or paste a URL. Leave empty for the default abstract animation.
                    </p>
                </div>

                {/* Preview Area */}
                <div className="mt-8">
                    <label className="block text-sm font-medium mb-4">Preview (Mockup)</label>
                    <div
                        className="relative h-40 rounded-xl overflow-hidden flex items-center justify-center border border-border bg-slate-50"
                        style={{
                            backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {!settings.backgroundImage && (
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        )}
                        <h1
                            className="text-2xl font-bold z-10"
                            style={{ color: settings.textColor }}
                        >
                            Nalimudheen
                        </h1>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    )
}
