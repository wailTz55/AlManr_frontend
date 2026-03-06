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

      <footer className="relative z-10 py-16 text-center bg-[#fff8ea] text-foreground rounded-t-[3rem] md:rounded-t-[5rem] overflow-hidden mt-12 mx-auto shadow-[0_-10px_40px_-15px_rgba(217,119,6,0.15)] border-t border-primary/10 w-full max-w-[2000px]">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-4 text-primary drop-shadow-sm">الرابطة الولائية</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">نحو مستقبل أفضل للشباب</p>

          <div className="w-24 h-1 bg-primary/20 mx-auto rounded-full mb-8"></div>

          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-base text-muted-foreground">صمم بواسطة</p>
            <a
              href="/developer"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all"
            >
              فريق التطوير المتميز
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
