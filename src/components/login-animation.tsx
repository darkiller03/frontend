"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export function LoginAnimation() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-primary to-purple-600 text-white flex flex-col justify-center px-8 lg:px-12">
      {/* Background curved lines */}
      <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden opacity-20">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0"
        >
          <motion.path
            d="M0,1000 C300,800 400,600 1000,800 L1000,1000 L0,1000 Z"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />
          <motion.path
            d="M0,1000 C200,850 500,700 1000,900 L1000,1000 L0,1000 Z"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
          />
        </svg>
      </div>

      {/* Content */}
      <motion.div
        className="z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Chat Assistant
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-white/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          The most intelligent AI chat platform
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
            <button 
          onClick={() => router.push("/")} // Add this onClick handler
          className="bg-white text-primary font-medium py-2 px-6 rounded-full hover:bg-white/90 transition-colors"
        >
          Learn More
        </button>
        </motion.div>
      </motion.div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Circles */}
        <motion.div
          className="absolute w-64 h-64 rounded-full border border-white/20"
          style={{ top: "15%", right: "-5%" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
        <motion.div
          className="absolute w-32 h-32 rounded-full border border-white/20"
          style={{ top: "30%", right: "15%" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.div
          className="absolute w-16 h-16 rounded-full bg-white/10"
          style={{ top: "20%", right: "10%" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        />

        {/* Dots pattern */}
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
                repeatDelay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}