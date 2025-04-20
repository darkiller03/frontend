"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LoginForm } from "@/components/login-form"
import { LoginAnimation } from "@/components/login-animation"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex min-h-screen flex-col">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Form on the left */}
        <motion.div
          className="flex-1 flex items-center justify-center p-6 md:p-10 bg-background"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <motion.h1
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Hello Again!
              </motion.h1>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Welcome Back
              </motion.p>
            </div>
            <LoginForm />
          </div>
        </motion.div>

        {/* Animation on the right */}
        <motion.div
          className="hidden md:block md:w-1/2 h-screen"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <LoginAnimation />
        </motion.div>
      </div>
    </div>
  )
}

