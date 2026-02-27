"use client"

import { useEffect, useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus, Trash2, Edit, Check, Star, Settings2, Eye, EyeOff } from "lucide-react"

import { api, PortfolioItem, SiteSettings } from "@/lib/api"
import { cn } from "@/lib/utils"

function SortableItem({ item, onEdit, onDelete }: { item: PortfolioItem; onEdit: () => void; onDelete: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="w-20 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                {item.isFeatured && (
                    <div className="absolute top-1 right-1 bg-primary p-1 rounded-full shadow-lg">
                        <Star className="w-2 h-2 text-primary-foreground fill-primary-foreground" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold truncate">{item.title}</h4>
                    {item.isFeatured && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Featured</span>}
                    {item.isHidden && <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-bold uppercase flex items-center gap-1"><EyeOff className="w-2 h-2" /> Hidden</span>}
                </div>
                <p className="text-sm text-muted-foreground">{item.category}</p>
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit()
                    }}
                    className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-primary transition-colors"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                    }}
                    className="p-2 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default function PortfolioAdmin() {
    const [items, setItems] = useState<PortfolioItem[]>([])
    const [loading, setLoading] = useState(true)
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
    const [isAdding, setIsAdding] = useState(false)
    const [showError, setShowError] = useState(false)
    const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
        title: "",
        category: "Graphic Design",
        image: "",
        description: "",
        tools: [],
        videoUrl: "",
        isFeatured: false,
        isHidden: false
    })

    // Site settings management
    const [sectionSettings, setSectionSettings] = useState<SiteSettings>({
        featuredTitle: "Selected Projects",
        visualTitle: "Visual Works",
        showFeatured: true,
        showVisual: true,
        seoTitle: "",
        metaDescription: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        showLocalSEO: true,
        localSEOContentEn: "",
        localSEOContentMl: ""
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        async function load() {
            const data = await api.portfolio.list()
            const settings = await api.settings.get()
            setItems(data)
            setSectionSettings(settings)
            setLoading(false)
        }
        load()
    }, [])

    // Auto-save settings
    useEffect(() => {
        if (!loading) {
            api.settings.update(sectionSettings)
        }
    }, [sectionSettings, loading])

    // Auto-fetch YouTube thumbnail
    useEffect(() => {
        if (newItem.videoUrl) {
            const thumb = api.utils.getYouTubeThumbnail(newItem.videoUrl)
            if (thumb && !newItem.image) {
                setNewItem(prev => ({ ...prev, image: thumb }))
            }
        }
    }, [newItem.videoUrl])

    useEffect(() => {
        if (editingItem?.videoUrl) {
            const thumb = api.utils.getYouTubeThumbnail(editingItem.videoUrl)
            // If it's a new video or an old broken high-res thumb, refresh it
            if (thumb && (!editingItem.image || editingItem.image.includes('maxresdefault'))) {
                setEditingItem(prev => prev ? { ...prev, image: thumb } : null)
            }
        }
    }, [editingItem?.videoUrl])

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id)
                const newIndex = items.findIndex((i) => i.id === over.id)
                const newItems = arrayMove(items, oldIndex, newIndex)
                api.portfolio.reorder(newItems)
                return newItems
            })
        }
    }


    const handleCreate = async () => {
        if (!newItem.title || (!newItem.image && !newItem.videoUrl)) {
            setShowError(true)
            return
        }

        const finalItem = {
            ...newItem,
            image: newItem.image || (newItem.videoUrl ? api.utils.getYouTubeThumbnail(newItem.videoUrl) : ""),
            order: items.length,
            slug: newItem.title?.toLowerCase().replace(/ /g, '-'),
            tools: newItem.tools || [],
            images: [],
            category: newItem.category || "Graphic Design",
            description: newItem.description || ""
        }

        await api.portfolio.create(finalItem as any)

        const data = await api.portfolio.list()
        setItems(data)
        setIsAdding(false)
        setShowError(false)
        setNewItem({
            title: "",
            category: "Graphic Design",
            image: "",
            description: "",
            tools: [],
            videoUrl: "",
            isFeatured: false,
            isHidden: false
        })
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this project?")) return

        await api.portfolio.delete(id)
        setItems(prev => prev.filter(i => i.id !== id))
        if (editingItem?.id === id) setEditingItem(null)
    }

    const saveEdit = async () => {
        if (!editingItem) return

        await api.portfolio.update(editingItem)
        setItems(prev => prev.map(i => i.id === editingItem.id ? editingItem : i))
        setEditingItem(null)
    }

    const handleClearAll = async () => {
        if (!confirm("⚠️ DANGER: This will delete ALL portfolio projects. This cannot be undone!")) return
        if (!confirm("Are you absolutely sure? This will wipe your entire portfolio and start fresh.")) return

        await api.portfolio.clearAll()
        setItems([])
        setEditingItem(null)
    }

    if (loading) return <div className="p-12 text-center text-muted-foreground">Loading Portfolio...</div>

    return (
        <div className="p-8 max-w-5xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Portfolio Management</h1>
                    <p className="text-muted-foreground">Manage your featured projects and visual grid</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleClearAll}
                        className="flex items-center gap-2 bg-secondary text-muted-foreground px-6 py-3 rounded-xl font-bold hover:bg-destructive hover:text-white transition-all shadow-sm"
                        title="Delete everything and start fresh"
                    >
                        <Trash2 className="w-5 h-5" />
                        Clear All
                    </button>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20"
                    >
                        <Plus className="w-5 h-5" />
                        Add Project
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* List View */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Featured Projects (Selected Projects) */}
                    <div className="bg-card rounded-2xl border-2 border-primary/20 p-6 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Star className="w-5 h-5 text-primary fill-primary" />
                                Selected Projects
                            </h3>
                            <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-tighter">
                                {items.filter(i => i.isFeatured).length} Items
                            </span>
                        </div>

                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={items.filter(i => i.isFeatured).map(i => i.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-3">
                                    {items.filter(i => i.isFeatured).map((item) => (
                                        <SortableItem
                                            key={item.id}
                                            item={item}
                                            onEdit={() => setEditingItem(item)}
                                            onDelete={() => handleDelete(item.id)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>

                        {items.filter(i => i.isFeatured).length === 0 && (
                            <div className="py-12 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground text-sm">
                                No featured items. Toggle one to see it here.
                            </div>
                        )}
                    </div>

                    {/* Visual Works */}
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <GripVertical className="w-5 h-5 text-muted-foreground" />
                                Visual Works
                            </h3>
                            <span className="text-xs font-medium bg-secondary px-3 py-1 rounded-full">
                                {items.filter(i => !i.isFeatured).length} Items
                            </span>
                        </div>

                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={items.filter(i => !i.isFeatured).map(i => i.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-3">
                                    {items.filter(i => !i.isFeatured).map((item) => (
                                        <SortableItem
                                            key={item.id}
                                            item={item}
                                            onEdit={() => setEditingItem(item)}
                                            onDelete={() => handleDelete(item.id)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>

                    {/* Section Controls */}
                    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Settings2 className="w-5 h-5 text-muted-foreground" />
                            Section Display Settings
                        </h3>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Featured Section Title</label>
                                    <input
                                        type="text"
                                        value={sectionSettings.featuredTitle}
                                        onChange={e => setSectionSettings({ ...sectionSettings, featuredTitle: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Grid Section Title</label>
                                    <input
                                        type="text"
                                        value={sectionSettings.visualTitle}
                                        onChange={e => setSectionSettings({ ...sectionSettings, visualTitle: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <button
                                    onClick={() => setSectionSettings({ ...sectionSettings, showFeatured: !sectionSettings.showFeatured })}
                                    className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium", sectionSettings.showFeatured ? "bg-primary/5 border-primary text-primary" : "border-border text-muted-foreground")}
                                >
                                    {sectionSettings.showFeatured ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    Featured Projects: {sectionSettings.showFeatured ? 'Visible' : 'Hidden'}
                                </button>
                                <button
                                    onClick={() => setSectionSettings({ ...sectionSettings, showVisual: !sectionSettings.showVisual })}
                                    className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium", sectionSettings.showVisual ? "bg-primary/5 border-primary text-primary" : "border-border text-muted-foreground")}
                                >
                                    {sectionSettings.showVisual ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    Visual Grid: {sectionSettings.showVisual ? 'Visible' : 'Hidden'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form Sidebar */}
                <div className="lg:col-span-1">
                    {editingItem ? (
                        <div className="bg-card rounded-2xl border-2 border-primary/20 p-6 shadow-xl sticky top-8">
                            <h3 className="font-bold text-xl mb-6">Edit Project</h3>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title</label>
                                    <input
                                        type="text"
                                        value={editingItem.title}
                                        onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                                    <select
                                        value={editingItem.category}
                                        onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    >
                                        <option value="Graphic Design">Graphic Design</option>
                                        <option value="Videography/Editing">Videography/Editing</option>
                                        <option value="Motion Graphics">Motion Graphics</option>
                                        <option value="Photography">Photography</option>
                                        <option value="Social Media">Social Media</option>
                                        <option value="Website">Website</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl border border-border">
                                    <div className="flex items-center gap-2">
                                        <Star className={cn("w-4 h-4", editingItem.isFeatured ? "text-primary fill-primary" : "text-muted-foreground")} />
                                        <span className="text-sm font-bold">Featured Project</span>
                                    </div>
                                    <button
                                        onClick={() => setEditingItem({ ...editingItem, isFeatured: !editingItem.isFeatured })}
                                        className={cn("w-12 h-6 rounded-full relative transition-all", editingItem.isFeatured ? "bg-primary" : "bg-muted")}
                                    >
                                        <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", editingItem.isFeatured ? "right-1" : "left-1")} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl border border-border">
                                    <div className="flex items-center gap-2">
                                        {editingItem.isHidden ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-primary" />}
                                        <span className="text-sm font-bold">Hidden from Public</span>
                                    </div>
                                    <button
                                        onClick={() => setEditingItem({ ...editingItem, isHidden: !editingItem.isHidden })}
                                        className={cn("w-12 h-6 rounded-full relative transition-all", editingItem.isHidden ? "bg-muted" : "bg-primary/20")}
                                    >
                                        <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm", editingItem.isHidden ? "right-1" : "left-1")} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SEO Alt Text</label>
                                    <input
                                        type="text"
                                        placeholder="Project title + category + Kerala (Auto if empty)"
                                        value={editingItem.altText || ''}
                                        onChange={e => setEditingItem({ ...editingItem, altText: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image Title Attribute</label>
                                    <input
                                        type="text"
                                        value={editingItem.titleAttribute || ''}
                                        onChange={e => setEditingItem({ ...editingItem, titleAttribute: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tools (Comma separated)</label>
                                    <input
                                        type="text"
                                        value={editingItem.tools.join(', ')}
                                        onChange={e => setEditingItem({ ...editingItem, tools: e.target.value.split(',').map(s => s.trim()) })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">YouTube Video URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://youtube.com/watch?v=..."
                                        value={editingItem.videoUrl || ''}
                                        onChange={e => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2 pt-4 border-t border-border">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SEO Title</label>
                                    <input
                                        type="text"
                                        value={editingItem.seoTitle || ''}
                                        onChange={e => setEditingItem({ ...editingItem, seoTitle: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="flex gap-3 pt-6">
                                    <button
                                        onClick={saveEdit}
                                        className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-5 h-5" />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setEditingItem(null)}
                                        className="px-4 py-3 rounded-xl border border-border font-bold text-muted-foreground hover:bg-secondary transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card rounded-2xl border border-border border-dashed p-12 text-center text-muted-foreground flex flex-col items-center justify-center h-[400px]">
                            <Edit className="w-12 h-12 mb-4 opacity-20" />
                            <p>Select a project to edit its <br /> details and featured status.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Project Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-primary/20 shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
                            <h3 className="font-bold text-xl">Add New Project</h3>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Project Image {(!newItem.videoUrl) && <span className="text-destructive">*</span>}
                                    {newItem.videoUrl && <span className="text-primary ml-2">(Auto-fetched from Video)</span>}
                                </label>
                                <div className={cn(
                                    "border-2 border-dashed rounded-xl p-8 hover:bg-secondary/20 transition-colors text-center cursor-pointer relative group overflow-hidden",
                                    !newItem.image && !newItem.videoUrl && showError ? "border-destructive bg-destructive/5" : "border-border"
                                )}>
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                try {
                                                    const url = await api.storage.uploadImage(file)
                                                    setNewItem({ ...newItem, image: url })
                                                } catch (err: any) {
                                                    alert(err.message)
                                                }
                                            }
                                        }}
                                    />
                                    {newItem.image ? (
                                        <div className="relative w-full h-48">
                                            <img src={newItem.image} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white font-bold">Click to Change</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Plus className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-bold">Click to upload image</p>
                                                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 500KB)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {!newItem.image && !newItem.videoUrl && showError && (
                                    <p className="text-xs text-destructive font-bold">Image or Video URL is required</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Project Title <span className="text-destructive">*</span></label>
                                <input
                                    type="text"
                                    value={newItem.title}
                                    onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                    className={cn(
                                        "w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 ring-primary/20 outline-none transition-all",
                                        !newItem.title && showError ? "border-destructive" : "border-border"
                                    )}
                                    placeholder="e.g. Modern Brand Identity"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
                                    <select
                                        value={newItem.category}
                                        onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    >
                                        <option value="Graphic Design">Graphic Design</option>
                                        <option value="Videography/Editing">Videography/Editing</option>
                                        <option value="Motion Graphics">Motion Graphics</option>
                                        <option value="Photography">Photography</option>
                                        <option value="Social Media">Social Media</option>
                                        <option value="Website">Website</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Video URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={newItem.videoUrl}
                                        onChange={e => setNewItem({ ...newItem, videoUrl: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tools (Comma separated)</label>
                                <input
                                    type="text"
                                    value={newItem.tools?.join(', ')}
                                    onChange={e => setNewItem({ ...newItem, tools: e.target.value.split(',').map(s => s.trim()) })}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                    placeholder="Photoshop, Illustrator, Figma"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">SEO Alt Text</label>
                                    <input
                                        type="text"
                                        value={newItem.altText || ''}
                                        onChange={e => setNewItem({ ...newItem, altText: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                        placeholder="Project title + Kerala"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Title Attribute</label>
                                    <input
                                        type="text"
                                        value={newItem.titleAttribute || ''}
                                        onChange={e => setNewItem({ ...newItem, titleAttribute: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all"
                                        placeholder="Project Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                                <textarea
                                    value={newItem.description}
                                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 ring-primary/20 outline-none transition-all h-24 resize-none"
                                    placeholder="Brief description of the project..."
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-border">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newItem.isFeatured}
                                        onChange={e => setNewItem({ ...newItem, isFeatured: e.target.checked })}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm font-bold">Mark as Featured</span>
                                </label>
                            </div>

                            <div className="pt-6">
                                <button
                                    onClick={handleCreate}
                                    disabled={!newItem.title || (!newItem.image && !newItem.videoUrl)}
                                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
