import { EnhancedFloatingNavbar } from "@/components/enhanced-floating-navbar"
import { HeroSection } from "@/components/hero-section"
import { ActivitiesPreview } from "@/components/activities-preview"
import { NewsSection } from "@/components/news-section"
import { RegistrationSection } from "@/components/registration-section"
import { PartnersSection } from "@/components/members-section"
import { ScrollAnimation } from "@/components/scroll-animations"
import { fetchHomepageData } from "@/lib/data/homepage"

/**
 * ISR: rebuild this page on the server at most once every 60 seconds.
 * Between rebuilds, all users get the cached HTML — zero Supabase queries per visit.
 * Change the value (in seconds) to adjust freshness vs. performance trade-off.
 */
export const revalidate = 60

export default async function HomePage() {
  // All 3 datasets fetched in parallel, server-side, before HTML is sent to browser
  const { activities, news, members } = await fetchHomepageData()

  return (
    <main className="min-h-screen">
      <EnhancedFloatingNavbar />

      <section id="home">
        <HeroSection />
      </section>

      <ScrollAnimation animation="fade-in">
        <section id="activities" className="py-20">
          <ActivitiesPreview initialActivities={activities} />
        </section>
      </ScrollAnimation>

      <ScrollAnimation animation="slide-in-right" delay={200}>
        <section id="news" className="py-20 bg-muted/30">
          <NewsSection initialNews={news} />
        </section>
      </ScrollAnimation>

      <ScrollAnimation animation="slide-in-left" delay={400}>
        <section id="register" className="py-20">
          <RegistrationSection />
        </section>
      </ScrollAnimation>

      <ScrollAnimation animation="fade-in" delay={600}>
        <section id="members" className="py-20 bg-muted/30">
          <PartnersSection />
        </section>
      </ScrollAnimation>

      <footer className="bg-card py-12 text-center">
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
