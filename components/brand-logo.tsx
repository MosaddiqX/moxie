"use client"

import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BrandLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function BrandLogo({ className, size = "md" }: BrandLogoProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  }

  return (
    <Link href="/" className={cn("group flex items-center gap-2 transition-all duration-300", className)}>
      <div className="relative">
        <motion.div
          className="relative z-10"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <svg
            width={size === "sm" ? "28" : size === "md" ? "36" : "48"}
            height={size === "sm" ? "28" : size === "md" ? "36" : "48"}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all duration-300"
          >
            {/* Film reel outer circle */}
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />

            {/* Film reel inner circle */}
            <circle cx="24" cy="24" r="6" fill={isDark ? "#3CBFB4" : "#2A9D94"} />

            {/* Film sprocket holes */}
            <circle cx="24" cy="8" r="3" fill={isDark ? "#3CBFB4" : "#2A9D94"} />
            <circle cx="24" cy="40" r="3" fill={isDark ? "#3CBFB4" : "#2A9D94"} />
            <circle cx="8" cy="24" r="3" fill={isDark ? "#3CBFB4" : "#2A9D94"} />
            <circle cx="40" cy="24" r="3" fill={isDark ? "#3CBFB4" : "#2A9D94"} />

            {/* Diagonal sprocket holes */}
            <circle cx="13" cy="13" r="2.5" fill={isDark ? "#3CBFB4" : "#2A9D94"} />
            <circle cx="35" cy="13" r="2.5" fill={isDark ? "#3CBFB4" : "#2A9D94"} />
            <circle cx="13" cy="35" r="2.5" fill={isDark ? "#3CBFB4" : "#2A9D94"} />
            <circle cx="35" cy="35" r="2.5" fill={isDark ? "#3CBFB4" : "#2A9D94"} />

            {/* Film strip */}
            <path
              d="M46 24C46 36.1503 36.1503 46 24 46C11.8497 46 2 36.1503 2 24"
              stroke={isDark ? "#3CBFB4" : "#2A9D94"}
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute -inset-1 bg-accent/20 rounded-full blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 0.3, 0.5], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />
      </div>

      <div className="flex flex-col">
        <motion.span
          className={cn("font-playfair font-bold tracking-tight text-accent", sizeClasses[size])}
          initial={{ opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Moxie
        </motion.span>
        <motion.span
          className="text-xs text-muted-foreground tracking-widest uppercase -mt-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Cinema Experience
        </motion.span>
      </div>
    </Link>
  )
}

