"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ml"

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        "profile": "Profile",
        "journey": "My Journey",
        "experience": "Professional Experience",
        "media_coordinator": "Media Coordinator",
        "present": "Present",
        "work": "My Work",
        "projects": "Selected Projects",
        // Add more keys as needed
    },
    ml: {
        "profile": "പ്രൊഫൈൽ",
        "journey": "എന്റെ യാത്ര",
        "experience": "തൊഴിൽ പരിചയം",
        "media_coordinator": "മീഡിയ കോർഡിനേറ്റർ",
        "present": "ഇപ്പോൾ",
        "work": "എന്റെ വർക്കുകൾ",
        "projects": "തിരഞ്ഞെടുത്ത പ്രോജക്റ്റുകൾ",
    }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en")

    const t = (key: string) => {
        return translations[language][key] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
