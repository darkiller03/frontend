"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChatSidebar } from "@/components/chat-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

type UserData = {
  name: string
  email: string
  isAuthenticated: boolean
}

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [chatHistory, setChatHistory] = useState([
    { id: "1", title: "Project brainstorming", date: new Date(2025, 2, 25), active: true },
    { id: "2", title: "Marketing strategy", date: new Date(2025, 2, 24), active: false },
    { id: "3", title: "Website redesign", date: new Date(2025, 2, 23), active: false },
    { id: "4", title: "Product roadmap", date: new Date(2025, 2, 22), active: false },
  ])

  // Load user data from localStorage
  useEffect(() => {
    const authData = localStorage.getItem("chatAuth")
    if (authData) {
      try {
        const parsedData = JSON.parse(authData)
        setUserData(parsedData)
      } catch (error) {
        console.error("Failed to parse auth data:", error)
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }, [router])

  if (!userData) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <ChatSidebar
        chatHistory={chatHistory}
        activeChatId={chatHistory.find(chat => chat.active)?.id || null}
        onNewChat={() => {}}
        onSelectChat={() => {}}
        onDeleteChat={() => {}}
      />
      <SidebarInset className="flex flex-col min-h-screen">
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

