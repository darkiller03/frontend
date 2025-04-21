"use client"
export const dynamic = "force-dynamic"

import { Suspense } from "react"
import { ChatWrapper } from "@/components/chat-wrapper"

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ChatWrapper />
    </Suspense>
  )
}
