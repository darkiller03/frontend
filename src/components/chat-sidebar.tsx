"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Plus, Settings, User2, Trash2, Search, X } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarMenuAction,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ChatHistory = {
  id: string
  title: string
  date: Date
}

interface ChatSidebarProps {
  chatHistory: ChatHistory[]
  activeChatId: string | null  // Add this line
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (e: React.MouseEvent, id: string) => void
}

export function ChatSidebar({ chatHistory, activeChatId,onNewChat, onSelectChat, onDeleteChat }: ChatSidebarProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredChats, setFilteredChats] = useState<ChatHistory[]>(chatHistory)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredChats(chatHistory)
    } else {
      const filtered = chatHistory.filter((chat) => chat.title.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredChats(filtered)
    }
  }, [searchTerm, chatHistory])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <Sidebar variant="inset" collapsible="offcanvas" className="dark:bg-sidebar dark:border-sidebar-border">
      <SidebarHeader className="flex flex-col gap-2 p-4">
        <Button className="w-full h-12 rounded-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02]" onClick={onNewChat}>
          <Plus className="h-4 w-4" />
          New Chat
        </Button>

        <div className={`relative mt-2 transition-all duration-200 ${isSearchFocused ? "scale-[1.02]" : ""}`}>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 pr-8 py-2 transition-all duration-200 border-muted-foreground/30 focus:border-primary"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="bg-border" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            {filteredChats.length > 0 ? (
              <SidebarMenu>
                {filteredChats.map((chat) => (
                  <SidebarMenuItem key={chat.id} className="smooth-transition">
                    <SidebarMenuButton
                      isActive={activeChatId === chat.id}
                      onClick={() => onSelectChat(chat.id)}
                      tooltip={chat.title}
                      className="smooth-transition"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{chat.title}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction 
                      onClick={(e) => onDeleteChat(e, chat.id)} // This triggers parent's handler
                      showOnHover 
                      className="smooth-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <div className="px-4 py-8 text-center animate-in">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mb-1">No conversations found</p>
                <p className="text-xs text-muted-foreground">
                  {searchTerm ? `No results for "${searchTerm}"` : "Start a new chat to begin"}
                </p>
                {searchTerm && (
                  <Button variant="ghost" size="sm" onClick={clearSearch} className="mt-2 text-xs">
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem className="smooth-transition">
            <SidebarMenuButton onClick={() => router.push("/profile")} className="smooth-transition">
              <User2 className="h-4 w-4" />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="smooth-transition">
            <SidebarMenuButton onClick={() => router.push("/settings")} className="smooth-transition">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

