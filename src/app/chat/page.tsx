"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)

  // Get conversation ID from URL and convert null to undefined
  const conversationId = searchParams.get('conversationId') || undefined

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch('http://localhost:8000/api/profile/', {
          headers: {'Authorization': `Bearer ${token}`}
        })
        
        if (!response.ok) throw new Error('Invalid session')
        
        setIsLoading(false)
      } catch (error) {
        localStorage.removeItem('access_token')
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full">
      <ChatInterface initialConversationId={conversationId} />
    </div>
  )
}