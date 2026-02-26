"use client"


import type React from "react"
import { useRouter } from "next/navigation"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Home, Users, Calendar, FileText, UserPlus, Phone, Menu, X, Move } from "lucide-react"

const navItems = [
  { id: "home", label: "الرئيسية", icon: Home, href: "/" },
  { id: "activities", label: "الأنشطة", icon: Calendar, href: "/activities" },
  // { id: "members", label: "الأعضاء", icon: Users, href: "/members" },
  { id: "news", label: "الأخبار", icon: FileText, href: "/news" },
  { id: "register", label: "التسجيل أو الدخول", icon: UserPlus, href: "/register" },
  { id: "contact", label: "اتصل بنا", icon: Phone, href: "/contact" },
]

export function EnhancedFloatingNavbar() {
  const [activeSection, setActiveSection] = useState<string>("")
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  // Always start at default position: center top
  // Use left: 50% and transform: translateX(-50%) for true horizontal centering
  // Track if user has dragged the navbar
  const [navPosition, setNavPosition] = useState<{ x: string; y: number }>({ x: "50%", y: 24 })
  const [hasDragged, setHasDragged] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Center horizontally on resize
  useEffect(() => {
    const handleResize = () => {
      setNavPosition(pos => ({ x: "50%", y: pos.y }))
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check initial login state
    const checkLoginState = () => {
      const token = localStorage.getItem("almanar_session")
      setIsLoggedIn(!!token)
    }

    checkLoginState()

    // Listen for storage changes from other tabs or components
    window.addEventListener("storage", checkLoginState)

    // Set active nav item based on current pathname
    const path = window.location.pathname
    const found = navItems.find(item => item.href === path)
    setActiveSection(found ? found.id : "home")

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    let animationFrameId: number | null = null
    let lastMouseEvent: MouseEvent | null = null

    const updatePosition = () => {
      if (isDragging && lastMouseEvent) {
        // Constrain to viewport
        const navWidth = navRef.current?.offsetWidth || 300
        const navHeight = navRef.current?.offsetHeight || 60
        const minX = 0
        const minY = 0
        const maxX = window.innerWidth - navWidth
        const maxY = window.innerHeight - navHeight
        let newX = lastMouseEvent.clientX - dragOffset.x
        let newY = lastMouseEvent.clientY - dragOffset.y
        newX = Math.max(minX, Math.min(newX, maxX))
        newY = Math.max(minY, Math.min(newY, maxY))
        setNavPosition({ x: `${newX}px`, y: newY })
        setHasDragged(true)
      }
      animationFrameId = null
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      if (isDragging) {
        lastMouseEvent = e
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(updatePosition)
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("storage", checkLoginState)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isDragging, dragOffset])

  const handleDragStart = (e: React.MouseEvent) => {
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
    }
  }

  // Do not persist position anymore

  const scrollToSection = (sectionId: string, href?: string) => {
    if (href && href.startsWith("/") && !href.includes("#")) {
      // Next.js client-side navigation
      router.push(href)
      setActiveSection(sectionId)
      setIsMobileMenuOpen(false)
      return
    }

    if (href && href.includes("#")) {
      // Handle anchor links (like /#register)
      const [path, anchor] = href.split("#")
      if (path === "/" && window.location.pathname === "/") {
        // Same page, scroll to section
        const element = document.getElementById(anchor)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
          setActiveSection(anchor)
        }
      } else {
        // Different page with anchor
        router.push(href)
      }
      setIsMobileMenuOpen(false)
      return
    }

    // Default section scrolling
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        ref={navRef}
        className={`fixed z-50 transition-all duration-500 hidden md:block ${isScrolled ? "scale-95 opacity-95" : "scale-100 opacity-100"
          } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          left: navPosition.x,
          top: navPosition.y,
          transform: (!hasDragged && !isDragging) ? "translateX(-50%)" : "none",
        }}
      >
        <div className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-full px-8 py-4 shadow-2xl hover-glow">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onMouseDown={handleDragStart}
              className="cursor-grab hover:cursor-grab active:cursor-grabbing p-2 "
              title="اسحب لتحريك الشريط"
            >
              <Move className="w-4 h-4 text-muted-foreground" />
            </Button>

            {navItems.map((item, index) => {
              // Modify label if the user is logged in
              let label = item.label
              let href = item.href
              if (item.id === "register" && isLoggedIn) {
                label = "حساب الجمعية"
                href = "/register"
              }

              const Icon = item.icon
              const isActive = activeSection === item.id || (item.id === "register" && typeof window !== 'undefined' && window.location.pathname === "/register")
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => scrollToSection(item.id, href)}
                  className={`relative rounded-full transition-all duration-300 hover-lift !cursor-pointer ${isActive
                    ? "bg-primary text-primary-foreground animate-pulse-glow"
                    : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <Icon className="w-4 h-4 ml-2" />
                  <span className="text-sm font-medium">{label}</span>
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-bounce-gentle" />
                  )}
                </Button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed top-4 right-4 z-50 md:hidden">
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-full w-12 h-12 p-0 animate-pulse-glow"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 right-0 bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl animate-scale-in min-w-48">
            <div className="space-y-2 ">
              {navItems.map((item, index) => {
                let label = item.label
                let href = item.href
                if (item.id === "register" && isLoggedIn) {
                  label = "حساب الجمعية"
                  href = "/register"
                }
                const Icon = item.icon
                const isActive = activeSection === item.id || (item.id === "register" && typeof window !== 'undefined' && window.location.pathname === "/register")
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => scrollToSection(item.id, href)}
                    className={`w-full justify-start rounded-xl transition-all duration-300  ${isActive ? "animate-pulse-glow" : ""
                      }`}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <Icon className="w-4 h-4 ml-2" />
                    <span className="text-sm font-medium">{label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Cursor Follower (Desktop only) */}
      <div
        className="fixed pointer-events-none z-40 hidden lg:block"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
          transition: "all 0.1s ease-out",
        }}
      >
        <div className="w-5 h-5 bg-primary/20 rounded-full animate-pulse" />
      </div>
    </>
  )
}
