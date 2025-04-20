"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useTheme } from "next-themes"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  ChevronRight,
  Clock,
  Users,
  Zap,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Brain,
  BotIcon as Robot,
  Star,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TransitionLoader } from "@/components/transition-loader"

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { resolvedTheme } = useTheme()
  const [showTransitionLoader, setShowTransitionLoader] = useState(false)

  // For typewriter effect
  const [text, setText] = useState("")
  const fullText = "Your AI-powered assistant for handling customer queries efficiently and accurately."
  const [typingIndex, setTypingIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(50) // Milliseconds per character

  // For animated sections
  const heroRef = useRef<HTMLDivElement>(null)
  const metricsRef = useRef<HTMLDivElement>(null)
  const guideRef = useRef<HTMLDivElement>(null)
  const updatesRef = useRef<HTMLDivElement>(null)

  // For scroll animations
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5])
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

  const SectionDivider = () => {
    const { theme } = useTheme()
    return (
      <div className="w-full flex justify-center py-8">
        <div
          className={`h-[1px] w-3/4 transition-colors duration-300 ${theme === "dark" ? "bg-white/20" : "bg-gray-300"}`}
        />
      </div>
    )
  }

  useEffect(() => {
    setMounted(true)
    // Check if user is authenticated
    const authData = localStorage.getItem("chatAuth")
    if (authData) {
      try {
        const parsedData = JSON.parse(authData)
        setIsAuthenticated(parsedData.isAuthenticated)
      } catch (error) {
        console.error("Failed to parse auth data:", error)
      }
    }
  }, [])

  // Typewriter effect
  const animateText = useCallback(() => {
    if (!isDeleting) {
      if (typingIndex < fullText.length) {
        setText((prev) => prev + fullText[typingIndex])
        setTypingIndex((prev) => prev + 1)
        setTypingSpeed(50)
      } else {
        // Pause at end before deleting
        setTypingSpeed(1500)
        setIsDeleting(true)
      }
    } else {
      if (typingIndex > 0) {
        setText((prev) => prev.slice(0, -1))
        setTypingIndex((prev) => prev - 1)
        setTypingSpeed(30)
      } else {
        // Pause at start before typing again
        setTypingSpeed(500)
        setIsDeleting(false)
      }
    }
  }, [typingIndex, isDeleting, fullText])

  useEffect(() => {
    const timer = setTimeout(animateText, typingSpeed)
    return () => clearTimeout(timer)
  }, [animateText, typingSpeed])

  // For floating elements animation
  const floatingElements = [
    { icon: <MessageSquare />, size: "w-12 h-12", initialPosition: { x: -50, y: 100 }, duration: 8 },
    { icon: <Star />, size: "w-8 h-8", initialPosition: { x: 150, y: 150 }, duration: 12 },
    { icon: <Brain />, size: "w-10 h-10", initialPosition: { x: 200, y: 50 }, duration: 10 },
    { icon: <Robot />, size: "w-14 h-14", initialPosition: { x: -150, y: -50 }, duration: 9 },
    { icon: <Sparkles />, size: "w-6 h-6", initialPosition: { x: 80, y: -120 }, duration: 7 },
  ]

  if (!mounted) return null

  // Sample data for the dashboard
  const announcements = [
    {
      id: 1,
      title: "New AI Model Deployed",
      description:
        "We've upgraded to the latest LLaMA 3.2 model for improved responses and better understanding of complex queries. Try it out today!",
      date: "2 days ago",
      badge: "New",
    },
    {
      id: 2,
      title: "Training Session",
      description:
        "Join us for a training session on advanced prompting techniques to help you get the most out of our AI assistant for your customer service needs.",
      date: "1 week ago",
      badge: "Training",
    },
    {
      id: 3,
      title: "System Maintenance",
      description:
        "Scheduled maintenance on April 15th from 2-4 AM EST. During this time, the system will be in read-only mode. Please plan accordingly.",
      date: "2 weeks ago",
      badge: "Maintenance",
    },
  ]

  const performanceMetrics = [
    {
      name: "Queries Answered",
      value: 1248,
      icon: MessageSquare,
      change: "+12%",
      color: "text-blue-500",
      gradient: "from-blue-500 to-purple-500",
      progress: 82, // Fixed progress value
    },
    {
      name: "Avg. Response Time",
      value: "1.8s",
      icon: Clock,
      change: "-0.3s",
      color: "text-green-500",
      gradient: "from-green-500 to-emerald-400",
      progress: 68,
    },
    {
      name: "Active Agents",
      value: 24,
      icon: Users,
      change: "+3",
      color: "text-purple-500",
      gradient: "from-purple-600 to-pink-500",
      progress: 75,
    },
    {
      name: "Satisfaction Rate",
      value: "94%",
      icon: Award,
      change: "+2%",
      color: "text-amber-500",
      gradient: "from-amber-500 to-orange-400",
      progress: 94,
    },
  ]

  const usageSteps = [
    {
      title: "Start a Conversation",
      description:
        "Click on 'New Chat' to begin a new conversation with the AI assistant. You can ask any question related to customer support.",
      icon: MessageSquare,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Ask Questions",
      description:
        "Type your query in the input field and press Enter or click the send button. The assistant will process your question instantly.",
      icon: Zap,
      gradient: "from-purple-600 to-pink-600",
    },
    {
      title: "Review Responses",
      description:
        "The AI will provide answers that you can rate with thumbs up/down for feedback. This helps improve future responses.",
      icon: BookOpen,
      gradient: "from-amber-500 to-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {showTransitionLoader && <TransitionLoader />}
      {/* Floating elements in the background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className={`absolute opacity-5 rounded-full ${element.size} text-primary`}
            initial={{
              x: element.initialPosition.x,
              y: element.initialPosition.y,
              opacity: 0.05,
            }}
            animate={{
              x: [element.initialPosition.x, element.initialPosition.x + 50, element.initialPosition.x],
              y: [element.initialPosition.y, element.initialPosition.y - 30, element.initialPosition.y],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: element.duration,
              ease: "easeInOut",
            }}
          >
            {element.icon}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <MessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">ChatTT</h1>
          </motion.div>
          <motion.div
            className="flex items-center space-x-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ThemeToggle />
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  setShowTransitionLoader(true)
                  setTimeout(() => {
                    router.push("/chat")
                  }, 1500)
                }}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <span>Go to Chat</span>
                <motion.div
                  className="inline-block ml-1"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                >
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section with Parallax */}
        <motion.section className="mb-24 relative" ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }}>
          <motion.div
            className="text-center max-w-4xl mx-auto relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block mb-6 bg-primary/10 p-3 rounded-xl"
            >
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 px-4 py-1 text-sm rounded-full">
                <Sparkles className="h-4 w-4 mr-1" /> AI-Powered Assistance
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Welcome to ChatTT Assistant
            </motion.h1>

            <div className="h-16 flex justify-center items-center mb-10">
              <motion.p
                className="text-xl font-medium text-foreground max-w-2xl text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key="typewriter"
              >
                {text}
                <motion.span
                  className="inline-block w-[2px] h-5 bg-primary ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
                />
              </motion.p>
            </div>

            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Background gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
        </motion.section>
        {/* 3D Marquee Section */}
        <motion.section
          className="mb-32"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto max-w-4xl">
            <div className="relative rounded-2xl border bg-background p-1 shadow-xl">
              {/* Theme-aware chat preview */}
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                <Image
                  src={`/image/chat-${resolvedTheme || "light"}.png`}
                  alt="Chat interface preview"
                  fill
                  className="object-cover object-top"
                  quality={100}
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Interactive elements */}
              <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
                <Button
                  onClick={() => {
                    if (isAuthenticated) {
                      setShowTransitionLoader(true)
                      setTimeout(() => {
                        router.push("/chat")
                      }, 1500)
                    } else {
                      router.push("/login")
                    }
                  }}
                  className="rounded-full bg-gradient-to-r from-primary to-purple-600 px-8 py-6 text-lg shadow-lg hover:shadow-xl"
                >
                  {isAuthenticated ? "Open Chat" : "Try Now"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        <SectionDivider />

        {/* Performance Metrics */}
        <motion.section
          className={`mb-32 pt-10 `}
          ref={metricsRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl font-bold mb-3 text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Performance Metrics
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center max-w-xl mx-auto mb-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            See how our AI assistant is helping customer service teams improve efficiency
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="overflow-hidden border-none shadow-lg group hover:shadow-xl transition-all duration-300">
                  <div className={`h-2 w-full bg-gradient-to-r ${metric.gradient}`}></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{metric.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full bg-${metric.color.split("-")[1]}-100 dark:bg-${metric.color.split("-")[1]}-900/20 ${metric.color} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <metric.icon className="h-5 w-5" />
                        </div>
                        <span className="text-3xl font-bold ml-3">{metric.value}</span>
                      </div>
                      <Badge
                        variant={metric.change.startsWith("+") ? "default" : "secondary"}
                        className="rounded-full px-3"
                      >
                        {metric.change}
                      </Badge>
                    </div>
                    <Progress
                      value={metric.progress}
                      className="h-1.5 mt-6"
                      style={{ transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <SectionDivider />

        {/* Usage Guide */}
        <motion.section
          className="mb-32 pt-10"
          ref={guideRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl font-bold mb-3 text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How to Use ChatTT
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-center max-w-xl mx-auto mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Get started in just a few simple steps and transform your customer service experience
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {usageSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className={`h-2 w-full bg-gradient-to-r ${step.gradient}`}></div>
                  <CardHeader>
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      <step.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-base">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              onClick={() => {
                if (isAuthenticated) {
                  setShowTransitionLoader(true)
                  setTimeout(() => {
                    router.push("/chat")
                  }, 1500)
                } else {
                  router.push("/login")
                }
              }}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all text-lg group"
              size="lg"
            >
              {isAuthenticated ? "Start Chatting" : "Login to Start"}
              <motion.div
                className="inline-block ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              >
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.section>

        <SectionDivider />

        {/* Recent Updates/Announcements */}
        <motion.section
          className={`mb-32 pt-10 `}
          ref={updatesRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-center mb-12">
            <motion.h2
              className="text-3xl font-bold"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Recent Updates
            </motion.h2>
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            ></motion.div>
          </div>

          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {announcement.title}
                      </CardTitle>
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 rounded-full px-3">
                        {announcement.badge}
                      </Badge>
                    </div>
                    <CardDescription>{announcement.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base">{announcement.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <SectionDivider />
        {/* FAQ Section */}
        <motion.section
          className="mb-32 pt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-4 max-w-4xl mx-auto">
            {[
              {
                question: "How does the AI handle complex customer queries?",
                answer:
                  "Our AI assistant uses advanced natural language processing (NLP) and machine learning models to understand context, maintain conversation history, and provide accurate responses even to multi-part questions.",
              },
              {
                question: "Can I customize the AI's responses?",
                answer:
                  "Yes! You can create custom response templates through our dashboard. The AI learns from your feedback and previous interactions to improve over time.",
              },
              {
                question: "What integrations do you support?",
                answer:
                  "We integrate with popular platforms like Zendesk, Shopify, and Slack. Our API allows custom integrations with any system.",
              },
              {
                question: "How do you ensure data security?",
                answer:
                  "All data is encrypted (AES-256). We're SOC2 compliant with regular security audits and role-based access control.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="border rounded-xl bg-background overflow-hidden">
                  <Button
                    variant="ghost"
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    className="w-full h-auto p-6 flex justify-between items-center hover:bg-muted/10"
                  >
                    <h3 className="text-left text-lg font-semibold">{faq.question}</h3>
                    <motion.div animate={{ rotate: activeIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                  </Button>

                  <AnimatePresence initial={false}>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          transition: {
                            height: { duration: 0.3 },
                            opacity: { duration: 0.2, delay: 0.1 },
                          },
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          transition: {
                            height: { duration: 0.3 },
                            opacity: { duration: 0.2 },
                          },
                        }}
                        className="px-6 pb-6 pt-4"
                      >
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          ></motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              className="flex items-center space-x-3 mb-6 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-xl">ChatTT</span>
            </motion.div>
            <motion.div
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              © {new Date().getFullYear()} ChatTT. All rights reserved.
            </motion.div>
          </div>
        </div>
      </footer>
      {showTransitionLoader && <TransitionLoader message="Loading your chat..." />}
    </div>
  )
}

