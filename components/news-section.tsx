"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import type { News } from "../app/api/type"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"

interface Props {
  /** Pre-fetched news from the server (RSC). No loading state needed on first render. */
  initialNews?: News[]
}

export function NewsSection({ initialNews = [] }: Props) {
  const router = useRouter()
  const [newsList] = useState<News[]>(initialNews)
  const [isMounted, setIsMounted] = useState(false)

  // Embla setup for the Cinematic Strip
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    direction: "rtl",
    duration: 45 // Smooth, Apple-like scrolling
  })

  // Navigation state for Embla
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect).on("select", onSelect)
  }, [emblaApi, onSelect])

  // Mount animation control
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Dynamic padding calculation for the cinematic strip alignment
  const titleContainerRef = React.useRef<HTMLDivElement>(null)
  const [edgePadding, setEdgePadding] = useState(16)

  useEffect(() => {
    const updatePadding = () => {
      if (titleContainerRef.current) {
        const rect = titleContainerRef.current.getBoundingClientRect()
        const edgeDistance = Math.max(rect.left, window.innerWidth - rect.right)
        setEdgePadding(edgeDistance + 16)
      }
    }

    updatePadding()
    const timeoutId = setTimeout(updatePadding, 100)

    window.addEventListener('resize', updatePadding)
    return () => {
      window.removeEventListener('resize', updatePadding)
      clearTimeout(timeoutId)
    }
  }, [])

  const navigateToNewsPage = (newsId?: number) => {
    if (newsId) {
      router.push(`/news?articleId=${newsId}`)
    } else {
      router.push('/news')
    }
  }

  const handleArticleClick = (newsItem: News) => {
    navigateToNewsPage(newsItem.id)
  }

  const displayImage = (imgStr: string | undefined) => {
    return imgStr && imgStr.trim() !== "" ? imgStr : "/placeholder.svg"
  }

  if (newsList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">الأخبار والإعلانات</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mt-6 rounded-full" />
        </div>
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">لا توجد أخبار متاحة حالياً</p>
        </div>
      </div>
    )
  }

  // --- Magazine Layout Splitting ---
  // 1. Cover Story (Most recent)
  const coverStory = newsList[0]
  // 2. Secondary Grid (next 3)
  const secondaryStories = newsList.slice(1, 4)
  // 3. Cinematic Strip (the remaining, up to limits)
  const cinematicStories = newsList.slice(4)

  return (
    <div className={`relative w-full py-16 overflow-hidden transition-all duration-1000 ease-out bg-zinc-50 dark:bg-zinc-950/20 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

      {/* Decorative Artistic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center opacity-40">
        <div className="absolute w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/4" />
        <div className="absolute w-[500px] h-[500px] bg-sky-400/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/4 pt-10" />
      </div>

      <div className="container mx-auto px-4 relative z-10" ref={titleContainerRef}>

        {/* Section Header */}
        <div className="text-right mb-10 md:mb-16 border-r-4 border-secondary pr-6">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-sm tracking-tight mb-2">أحدث الأخبار</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium">
            تغطية شاملة ومستمرة لجميع أنشطة وإعلانات الجمعية.
          </p>
        </div>

        {/* --- PART 1: Cover News --- */}
        {coverStory && (
          <div className="mb-8 md:mb-12">
            <Card
              className="relative group h-[500px] md:h-[650px] w-full rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border-0"
              onClick={() => handleArticleClick(coverStory)}
            >
              <Image
                src={displayImage(coverStory.image)}
                alt={coverStory.title}
                fill
                priority
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              {/* Dark Gradient Overlay for the Cover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none transition-opacity duration-500 group-hover:via-black/50" />

              <div className="absolute top-6 right-6 md:top-8 md:right-8">
                <span className="px-4 py-1.5 bg-secondary text-white rounded-full text-sm font-bold shadow-md">
                  {coverStory.category || "خبر رئيسي"}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 flex flex-col justify-end text-white text-right h-full pointer-events-none">
                <div className="max-w-4xl">
                  <div className="flex items-center justify-end gap-2 text-secondary/90 font-semibold mb-3">
                    <Calendar className="w-5 h-5" />
                    <span dir="ltr">{coverStory.date ? new Date(coverStory.date).toLocaleDateString("en-US") : ""}</span>
                  </div>
                  <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg mb-4">
                    {coverStory.title}
                  </h3>
                  <p className="text-white/80 line-clamp-2 md:line-clamp-3 text-base md:text-xl max-w-3xl ml-auto mb-6">
                    {coverStory.excerpt}
                  </p>

                  {/* Subtle 'Read More' that reveals on hover */}
                  <div className="inline-flex items-center gap-2 text-white font-semibold text-sm md:text-base border-b-2 border-transparent group-hover:border-secondary transition-all duration-300 pointer-events-auto">
                    قراءة التفاصيل
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* --- PART 2: Secondary News Grid --- */}
        {secondaryStories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
            {secondaryStories.map((story) => (
              <Card
                key={story.id}
                className="group cursor-pointer bg-card border-border/50 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 flex flex-col"
                onClick={() => handleArticleClick(story)}
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={displayImage(story.image)}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-xs font-medium">
                    {story.category || "عام"}
                  </div>
                  {/* Subtle edge gradient so image doesn't clash with white card completely */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1 text-right">
                  <div className="flex items-center justify-end gap-2 text-muted-foreground text-sm font-medium mb-3">
                    <Calendar className="w-4 h-4" />
                    <span dir="ltr">{story.date ? new Date(story.date).toLocaleDateString("en-US") : ""}</span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold leading-snug text-foreground mb-3 group-hover:text-secondary transition-colors line-clamp-3">
                    {story.title}
                  </h4>
                  <div className="mt-auto pt-4 flex items-center justify-end text-sm font-bold text-secondary group-hover:text-secondary/80">
                    <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    المزيد
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* --- PART 3: Cinematic News Strip --- */}
      {/* Only render if we have enough items, ensuring a clean UX */}
      {cinematicStories.length > 0 && (
        <div className="mt-8 md:mt-12 relative z-10 w-full">

          {/* Header & Controls for Strip */}
          <div className="container mx-auto px-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-right flex-1 border-r-4 border-muted pl-0 pr-4">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">المزيد من الأخبار</h3>
            </div>

            {/* Apple style floating controls */}
            <div className="hidden md:flex items-center gap-4 dir-ltr" dir="ltr">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 bg-background shadow-md border-border/50 hover:bg-secondary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed !cursor-pointer z-10"
                onClick={scrollNext}
                disabled={nextBtnDisabled}
                aria-label="الخبر السابق"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-12 h-12 bg-background shadow-md border-border/50 hover:bg-secondary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed !cursor-pointer z-10"
                onClick={scrollPrev}
                disabled={prevBtnDisabled}
                aria-label="الخبر التالي"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Embla Carousel Viewport */}
          <div className="overflow-hidden w-full pb-10" ref={emblaRef}>
            <div
              className="flex touch-pan-y gap-4 md:gap-6"
              style={{ paddingLeft: `${edgePadding}px`, paddingRight: `${edgePadding}px` }}
            >
              {cinematicStories.map((story) => (
                <div
                  key={story.id}
                  className="flex-none w-[80vw] sm:w-[320px] md:w-[380px] lg:w-[420px] cursor-grab active:cursor-grabbing"
                >
                  <Card
                    className="relative group h-[300px] md:h-[400px] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out border-0 bg-zinc-900"
                    onClick={() => handleArticleClick(story)}
                  >
                    <Image
                      src={displayImage(story.image)}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 320px, 420px"
                      draggable={false}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md text-white rounded-full text-xs font-medium">
                      {story.category || "عام"}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white text-right h-full pointer-events-none">
                      <div className="flex flex-wrap items-center justify-end gap-2 mb-2 text-secondary/90 font-medium text-xs md:text-sm">
                        <Calendar className="w-4 h-4" />
                        <span dir="ltr">{story.date ? new Date(story.date).toLocaleDateString("en-US") : ""}</span>
                      </div>
                      <h4 className="text-xl md:text-2xl font-bold leading-snug drop-shadow-md mb-2 line-clamp-2 md:line-clamp-3">
                        {story.title}
                      </h4>
                      {/* View Button fading in gracefully */}
                      <div className="mt-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <span className="inline-flex items-center text-secondary text-sm font-bold">
                          اقرأ المزيد <ArrowLeft className="w-4 h-4 mr-1" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shared Call to Action */}
      <div className="text-center mt-8 md:mt-16 container mx-auto px-4 relative z-10">
        <Button
          size="lg"
          variant="outline"
          className="text-lg px-8 py-4 rounded-full border-secondary text-secondary hover:bg-secondary hover:text-white transition-all shadow-md !cursor-pointer"
          onClick={() => navigateToNewsPage()}
        >
          أرشيف الأخبار كاملاً
          <ArrowLeft className="w-5 h-5 mr-2" />
        </Button>
      </div>

    </div>
  )
}