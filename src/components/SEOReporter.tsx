"use client"

import { useEffect } from "react"
import { api } from "@/lib/api"

export default function SEOReporter() {
    useEffect(() => {
        async function applySEO() {
            const settings = await api.settings.get()

            // 1. Update Document Title and Meta Tags
            if (settings.seoTitle) document.title = settings.seoTitle

            const metaDescription = document.querySelector('meta[name="description"]')
            if (metaDescription && settings.metaDescription) {
                metaDescription.setAttribute('content', settings.metaDescription)
            }

            // OG Tags
            const updateOG = (property: string, content: string) => {
                let tag = document.querySelector(`meta[property="${property}"]`)
                if (!tag) {
                    tag = document.createElement('meta')
                    tag.setAttribute('property', property)
                    document.head.appendChild(tag)
                }
                tag.setAttribute('content', content)
            }

            if (settings.ogTitle) updateOG('og:title', settings.ogTitle)
            if (settings.ogDescription) updateOG('og:description', settings.ogDescription)
            if (settings.ogImage) updateOG('og:image', settings.ogImage)

            // 2. Inject Combined JSON-LD Schema (Person, LocalBusiness, Service)
            const combinedSchema = {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "Person",
                        "@id": `${window.location.origin}/#person`,
                        "name": "Nalimudheen Wafy",
                        "jobTitle": "Graphic Designer and Media Coordinator",
                        "url": window.location.origin,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Malappuram",
                            "addressRegion": "Kerala",
                            "addressCountry": "India"
                        },
                        "sameAs": [
                            "https://www.linkedin.com/in/nalimudheen-wafy",
                            "https://www.instagram.com/nalimudheen_wafy",
                            "https://www.facebook.com/nalimudheen.wafy"
                        ]
                    },
                    {
                        "@type": "LocalBusiness",
                        "@id": `${window.location.origin}/#business`,
                        "name": "Nalimudheen Wafy - Media Services",
                        "image": settings.ogImage || `${window.location.origin}/logo.png`,
                        "url": window.location.origin,
                        "telephone": "+917907730393",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Kattilangadi",
                            "addressLocality": "Malappuram",
                            "addressRegion": "Kerala",
                            "postalCode": "676506",
                            "addressCountry": "India"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "11.0510",
                            "longitude": "76.0711"
                        },
                        "areaServed": "Kerala",
                        "priceRange": "$$"
                    },
                    {
                        "@type": "Service",
                        "serviceType": "Graphic Design and Media Production",
                        "provider": { "@id": `${window.location.origin}/#person` },
                        "areaServed": {
                            "@type": "State",
                            "name": "Kerala"
                        },
                        "description": "Professional graphic design, photography, videography, branding, and social media management services across Kerala."
                    }
                ]
            }

            let scriptTag = document.getElementById('json-ld-data') as HTMLScriptElement
            if (!scriptTag) {
                scriptTag = document.createElement('script')
                scriptTag.id = 'json-ld-data'
                scriptTag.type = 'application/ld+json'
                document.head.appendChild(scriptTag)
            }
            scriptTag.text = JSON.stringify(combinedSchema)
        }

        applySEO()
    }, [])

    return null
}
