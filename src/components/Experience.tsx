"use client"

import { motion } from "framer-motion"
import { Briefcase, Calendar, MapPin } from "lucide-react"

export default function Experience() {
    return (
        <section className="py-20 px-4 md:px-6 bg-secondary/30" id="experience">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">My Journey</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground">Professional Experience</h3>
                </motion.div>

                <div className="relative border-l-2 border-primary/20 ml-4 md:ml-12 space-y-12">
                    {/* Experience Item */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative pl-8 md:pl-12"
                    >
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />

                        <div className="bg-card p-6 md:p-10 rounded-3xl shadow-sm border border-border/50">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                                <div>
                                    <h4 className="text-2xl md:text-3xl font-bold text-foreground">Media Coordinator</h4>
                                    <div className="flex items-center gap-2 text-primary font-semibold mt-2">
                                        <Briefcase className="w-4 h-4" />
                                        <span>PMSA Orphanage Kattilangadi</span>
                                    </div>
                                </div>
                                <div className="flex flex-col md:items-end gap-1.5 text-sm font-medium text-muted-foreground">
                                    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full">
                                        <Calendar className="w-4 h-4" />
                                        <span>Present</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>Kerala, India</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-medium">
                                Leading the complete visual communication and media strategy for a multi-institution educational and social organization. Responsible for planning, executing, and maintaining consistent visual identity across schools, college, and digital platforms.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div>
                                    <h5 className="text-sm font-bold uppercase tracking-widest text-primary mb-5 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                        Institutions
                                    </h5>
                                    <ul className="space-y-3">
                                        {[
                                            "KYHSS Athavanad",
                                            "PMSA PTM HSS Vettichira",
                                            "SMSTM Women’s College (Calicut Univ.)",
                                            "Wafy College (Under CIC)"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm font-semibold text-foreground/80">
                                                <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h5 className="text-sm font-bold uppercase tracking-widest text-primary mb-5 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                        Key Responsibilities
                                    </h5>
                                    <ul className="space-y-4">
                                        {[
                                            "Graphic design for posters & branding",
                                            "Photography & official videography",
                                            "Motion graphics & video editing",
                                            "Social media content management",
                                            "Maintaining brand consistency",
                                            "Coordinating media workflows"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm">
                                                <div className="mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                                                <span className="text-muted-foreground font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
