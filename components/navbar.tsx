"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Search, Heart, Bookmark, Film, X, History, Home } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { BrandLogo } from "@/components/brand-logo"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Close menu when clicking outside
  useOnClickOutside([menuRef, buttonRef], () => setIsOpen(false))

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    // Set initial scroll state
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { href: "/movies", label: "Explore", icon: <Film className="h-4 w-4" /> },
    { href: "/watchlist", label: "Watchlist", icon: <Bookmark className="h-4 w-4" /> },
    { href: "/favorites", label: "Favorites", icon: <Heart className="h-4 w-4" /> },
    { href: "/recently-viewed", label: "History", icon: <History className="h-4 w-4" /> },
  ]

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ease-in-out",
        scrolled ? "glass-effect py-2 shadow-lg" : "bg-transparent py-4",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex items-center justify-between">
        <BrandLogo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 relative group",
                  pathname === item.href ? "text-accent" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.icon}
                {item.label}
                {pathname === item.href && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-accent/10 -z-10"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent group-hover:w-1/2 transition-all duration-300" />
              </Link>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: navItems.length * 0.1 + 0.3 }}
            className="ml-2"
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-2 border-accent/30 hover:bg-accent/10"
              onClick={() => router.push("/movies")}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: navItems.length * 0.1 + 0.4 }}
          >
            <ThemeToggle />
          </motion.div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full gap-1 border-accent/30 hover:bg-accent/10 px-2"
            onClick={() => router.push("/movies")}
          >
            <Search className="h-3.5 w-3.5" />
          </Button>

          <ThemeToggle />

          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            className="relative z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 glass-effect md:hidden"
              style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <motion.nav
                className="flex flex-col items-center justify-center h-full gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="w-full text-center"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "text-lg font-medium flex items-center justify-center gap-2 py-3 px-8 relative",
                        pathname === item.href ? "text-accent" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.icon}
                      {item.label}
                      {pathname === item.href && (
                        <motion.span
                          className="absolute inset-0 bg-accent/10 rounded-lg -z-10"
                          layoutId="mobile-navbar-indicator"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  className="pt-6"
                >
                  <BrandLogo size="lg" />
                </motion.div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

