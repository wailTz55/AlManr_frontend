import { EnhancedFloatingNavbar } from "@/components/enhanced-floating-navbar"
import { HeroSection } from "@/components/hero-section"
import { ActivitiesCarousel } from "@/components/activities-carousel"
import { PhotoAlbumSection } from "@/components/photo-album-section"
import { NewsSection } from "@/components/news-section"
import { RegistrationSection } from "@/components/registration-section"
import { ScrollAnimation } from "@/components/scroll-animations"
import { fetchHomepageData } from "@/lib/data/homepage"

/**
 * ISR: rebuild this page on the server at most once every 60 seconds.
 * Between rebuilds, all users get the cached HTML — zero Supabase queries per visit.
 * Change the value (in seconds) to adjust freshness vs. performance trade-off.
 */
export const revalidate = 60

export default async function HomePage() {
  // Datasets fetched in parallel, server-side, before HTML is sent to browser
  const { activities, news } = await fetchHomepageData()

  return (
    <main className="min-h-screen relative">
      {/* Global Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full animate-float" />
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-secondary/20 rounded-full animate-bounce-gentle" />
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 right-1/3 w-20 h-20 bg-primary/15 rounded-full animate-bounce-gentle"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <EnhancedFloatingNavbar />

      <section id="home">
        <HeroSection />
      </section>

      <ScrollAnimation animation="fade-in">
        <section id="activities" className="pt-4 pb-20">
          <ActivitiesCarousel initialActivities={activities} />
        </section>
      </ScrollAnimation>

      {/* Interactive Stacking Polaroid Album Section */}
      <section id="photo-album">
        <PhotoAlbumSection activities={activities} />
      </section>

      <ScrollAnimation animation="slide-in-right" delay={200}>
        <section id="news" className="py-20 relative z-10">
          <NewsSection initialNews={news} />
        </section>
      </ScrollAnimation>

      <ScrollAnimation animation="slide-in-left" delay={400}>
        <section id="register" className="py-20">
          <RegistrationSection />
        </section>
      </ScrollAnimation>

      <footer className="relative z-10 py-12 text-center bg-background/50 backdrop-blur-md border-t border-border/50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-primary mb-4 animate-bounce-gentle">جمعية المنار للشباب</h3>
          <p className="text-muted-foreground mb-6">نحو مستقبل أفضل للشباب العربي</p>
          <p className="text-sm text-muted-foreground">
            صمم بواسطة{" "}
            <a href="/developer" className="text-primary hover:underline animate-shimmer">
              فريق التطوير المتميز
            </a>
          </p>
        </div>
      </footer>
    </main>
  )
}
