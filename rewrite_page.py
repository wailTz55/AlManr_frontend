with open('app/page.tsx', 'w') as f:
    f.write("""import { EnhancedFloatingNavbar } from \"@/components/enhanced-floating-navbar\"
import { HeroSection } from \"@/components/hero-section\"
import { ActivitiesPreview } from \"@/components/activities-preview\"
import { NewsSection } from \"@/components/news-section\"
import { RegistrationSection } from \"@/components/registration-section\"
import { PartnersSection } from \"@/components/members-section\"

export default function HomePage() {
  return (
    <main className=\"min-h-screen bg-background\">
      <EnhancedFloatingNavbar />

      <section id=\"home\">
        <HeroSection />
      </section>

      <section id=\"activities\" className=\"py-20 overflow-hidden relative\">
        <div className=\"absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none\" />
        <ActivitiesPreview />
      </section>

      <section id=\"news\" className=\"py-24 bg-muted/30 overflow-hidden relative\">
        <div className=\"absolute top-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-border to-transparent\" />
        <NewsSection />
        <div className=\"absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-border to-transparent\" />
      </section>

      <section id=\"register\" className=\"py-24 overflow-hidden relative\">
        <RegistrationSection />
      </section>

      <section id=\"members\" className=\"py-24 bg-gradient-to-b from-muted/30 to-background overflow-hidden relative\">
        <div className=\"absolute top-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-border to-transparent\" />
        <PartnersSection />
      </section>

      <footer className=\"bg-card py-16 text-center border-t border-border/50 relative overflow-hidden\">
        <div className=\"absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay\"></div>
        <div className=\"container mx-auto px-4 relative z-10\">
          <h3 className=\"text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 inline-block\">جمعية المنار للشباب</h3>
          <p className=\"text-muted-foreground mb-8 text-lg font-medium\">نحو مستقبل أفضل للشباب العربي</p>
          <div className=\"w-24 h-px bg-border mx-auto mb-8\" />
          <p className=\"text-sm text-muted-foreground/80\">
            صمم بواسطة{\" \"}
            <a href=\"/developer\" className=\"text-primary hover:text-primary/80 font-semibold hover:underline transition-all duration-300\">
              فريق التطوير المتميز
            </a>
          </p>
        </div>
      </footer>
    </main>
  )
}
""")
