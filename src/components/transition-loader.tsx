"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"

interface TransitionLoaderProps {
  message?: string
}

export function TransitionLoader({ message = "Loading your chat..." }: TransitionLoaderProps) {
  // Prevent scrolling while loader is active
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 to-purple-600/20 animate-pulse" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600 text-white">
            <MessageSquare className="h-8 w-8" />
          </div>
        </motion.div>

        <motion.div
          className="space-y-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="text-xl font-medium">{message}</h3>
          <p className="text-sm text-muted-foreground">Please wait while we prepare your experience</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4"
        >
          <div className="flex space-x-2">
            <div
              className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-purple-600 animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-purple-600 animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-primary to-purple-600 animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

