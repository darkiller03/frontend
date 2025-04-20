"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { TransitionLoader } from "./transition-loader"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })
  const [showTransitionLoader, setShowTransitionLoader] = useState(false)

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    }
    let isValid = true

    if (!formData.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // handleSubmit 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Login failed')
      }

      const { access, refresh } = await response.json()
      
      // Store tokens securely
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)

      // Get user profile
      const profileResponse = await fetch('http://localhost:8000/api/profile/', {
        headers: {'Authorization': `Bearer ${access}`}
      })
      const userData = await profileResponse.json()

      // Set authenticated user
      localStorage.setItem('chatAuth', JSON.stringify({
        ...userData,
        isAuthenticated: true
      }))

      setShowTransitionLoader(true)
      setTimeout(() => router.push("/chat"), 1500)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
        >
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            aria-invalid={!!errors.email}
            className="h-12 rounded-lg smooth-transition focus:scale-[1.01]"
          />
          {errors.email && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {errors.email}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 px-0 text-sm text-muted-foreground smooth-transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="mr-1 h-3.5 w-3.5" /> : <Eye className="mr-1 h-3.5 w-3.5" />}
              {showPassword ? "Hide" : "Show"}
            </Button>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              aria-invalid={!!errors.password}
              className="h-12 rounded-lg smooth-transition focus:scale-[1.01]"
            />
          </div>
          {errors.password && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {errors.password}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            className="w-full h-12 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Logging in...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                Login
              </span>
            )}
          </Button>
        </motion.div>

        <motion.div
          className="text-center pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
        >
          <Link href="#" className="text-sm text-primary hover:underline smooth-transition">
            Forgot Password?
          </Link>
        </motion.div>

        <motion.p
          className="text-center text-sm text-muted-foreground pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9, ease: "easeOut" }}
        >
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline smooth-transition">
            Register
          </Link>
        </motion.p>
      </form>
      {showTransitionLoader && <TransitionLoader />}
    </motion.div>
  )
}

