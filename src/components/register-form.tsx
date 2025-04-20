"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { TransitionLoader } from "@/components/transition-loader"

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showTransitionLoader, setShowTransitionLoader] = useState(false)

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
    let isValid = true

    if (!formData.name) {
      newErrors.name = "Name is required"
      isValid = false
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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

  //handleSubmit 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
  
    setIsLoading(true)
  
    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.name
        })
      });
  
      const data = await response.json(); // Always parse as JSON
  
      if (!response.ok) {
        // Handle backend validation errors
        if (data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(data.error || 'Registration failed');
      }
  
      toast.success("Your account has been created. Please login.")
      setShowTransitionLoader(true)
      setTimeout(() => router.push("/login"), 1500)
    } catch (error) {
      toast.error((error instanceof Error ? error.message : 'An error occurred. Please try again.'))
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
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            aria-invalid={!!errors.name}
            className="h-12 rounded-lg smooth-transition focus:scale-[1.01]"
          />
          {errors.name && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {errors.name}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
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
          transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" }}
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
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
        >
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            aria-invalid={!!errors.confirmPassword}
            className="h-12 rounded-lg smooth-transition focus:scale-[1.01]"
          />
          {errors.confirmPassword && (
            <motion.p
              className="text-sm text-destructive"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {errors.confirmPassword}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="pt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9, ease: "easeOut" }}
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
                Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                Register
              </span>
            )}
          </Button>
        </motion.div>

        <motion.p
          className="text-center text-sm text-muted-foreground pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1, ease: "easeOut" }}
        >
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline smooth-transition">
            Login
          </Link>
        </motion.p>
      </form>
      {showTransitionLoader && <TransitionLoader message="Creating your account..." />}
    </motion.div>
  )
}

