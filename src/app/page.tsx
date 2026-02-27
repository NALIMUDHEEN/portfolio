import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react"
import Hero from "@/components/Hero"
import Experience from "@/components/Experience"
import PortfolioGrid from "@/components/PortfolioGrid"
import FloatingWhatsApp from "@/components/FloatingWhatsApp"

export default function Home() {
  // ---------------------------------------------------------
  // 🔗 SOCIAL MEDIA LINKS CONFIGURATION
  // ---------------------------------------------------------
  // Replace the '#' inside the quotes with your actual profile URLs
  const socialLinks = {
    instagram: "https://instagram.com/zangles.me",
    facebook: "https://facebook.com/your_username",
    linkedin: "https://linkedin.com/in/nalimudheen-a-9a7150241",
    youtube: "https://youtube.com/@zangles7569?si=Wb-94tP9bc7TxlTs"
  }

  return (
    <main className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden selection:bg-primary/20">
      <Hero />
      <PortfolioGrid />
      <Experience />
      <FloatingWhatsApp />

      {/* Footer */}
      <footer className="py-12 text-center border-t border-border mt-12 bg-secondary/20">
        <div className="flex justify-center gap-6 mb-8">
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-colors duration-300"
            title="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          {/* <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-colors duration-300"
            title="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a> */}
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-colors duration-300"
            title="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-colors duration-300"
            title="YouTube"
          >
            <Youtube className="w-5 h-5" />
          </a>
        </div>
        <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Nalimudheen. All rights reserved.</p>
        <p className="mt-2 text-xs text-muted-foreground/60">Designed & Built by Nalimudheen</p>
      </footer>
    </main>
  )
}
