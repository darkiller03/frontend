"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Send, LogOut, Mic, Image, MessageSquare, Zap, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatMessage } from "@/components/chat-message"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { AppFooter } from "@/components/app-footer"
import { Bot } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ChatInterfaceProps {
  initialConversationId?: string;
}

type MessageRole = "user" | "assistant";

type Message = {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
};


type ChatHistory = {
  id: string
  title: string
  date: Date
}

type UserData = {
  full_name: string
  email: string
  isAuthenticated: boolean
}

export function ChatInterface({ initialConversationId }: ChatInterfaceProps) {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isNewChat, setIsNewChat] = useState(true); 
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [, updateState] = useState<{}>();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const activeChat = chatHistory.find(chat => chat.id === activeChatId) || null;
  const [hasInitialMessage, setHasInitialMessage] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const authData = localStorage.getItem("chatAuth")
    if (authData) {
      try {
        const parsedData = JSON.parse(authData)
        setUserData({
          full_name: parsedData.full_name,
          email: parsedData.email,
          isAuthenticated: true
        })
        fetchConversations()
      } catch (error) {
        handleLogout()
      }
    } else {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    if (initialConversationId && chatHistory.length > 0) {
      const exists = chatHistory.some(c => c.id === initialConversationId)
      exists && setActiveConversation(initialConversationId)
    } else if (chatHistory.length > 0) {
      setActiveConversation(chatHistory[0].id)
    }
  }, [chatHistory, initialConversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    if (messages.length > 0) inputRef.current?.focus()
  }, [messages])

  // Focus input when chat changes
  useEffect(() => {
    if (!isNewChat && chatHistory.length > 0) {
      inputRef.current?.focus();
    }
  }, [isNewChat, chatHistory.length]);


  // Add this useEffect to listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chatAuth') {
        try {
          const newData = JSON.parse(e.newValue || '{}');
          setUserData({
            full_name: newData.full_name,
            email: newData.email,
            isAuthenticated: true
          });
        } catch (error) {
          console.error("Failed to parse updated auth data:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add this useEffect to handle scroll after updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, forceUpdate]);

  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/rag/conversations/', {
        headers: {'Authorization': `Bearer ${token}`}
      });
      
      const data = await response.json();
      const conversations = data.map((conv: any) => ({
        id: conv.id.toString(),
        title: conv.title,
        date: new Date(conv.created_at)
      }));
  
      setChatHistory(conversations);
      
      if (conversations.length > 0) {
        const initialId = initialConversationId || conversations[0].id;
        setActiveChatId(initialId);
      }
    } catch (error) {
      toast.error('Failed to load conversations');
    }
  }, [initialConversationId]);
  
  // Update the fetchMessages function
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `http://localhost:8000/api/rag/chat/${conversationId}/messages/`, 
        { headers: {'Authorization': `Bearer ${token}`} }
      )

      if (!response.ok) throw new Error('Failed to load messages')
      
      const data = await response.json()
      const fetchedMessages = data.map((msg: any) => ({
        id: msg.id.toString(),
        content: msg.content,
        role: msg.role as MessageRole, // Type assertion to ensure it's MessageRole
        timestamp: new Date(msg.timestamp)
      }));
      
      setMessages(fetchedMessages);
      
      // If there are no messages, add the welcome message
      if (fetchedMessages.length === 0) {
        addWelcomeMessage(conversationId);
      }
    } catch (error) {
      toast.error('Failed to load messages')
      setMessages([])
    }
  }, [])

  // Add a welcome message when starting a new conversation
  const addWelcomeMessage = async (conversationId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const welcomeMessage = "Hello! I'm your AI assistant. How can I help you today?";
      
      // Add temporary welcome message for immediate display
      setMessages([{
        id: 'welcome-temp',
        content: welcomeMessage,
        role: 'assistant' as MessageRole, // Explicitly cast as MessageRole
        timestamp: new Date()
      }]);
      
      // Send the welcome message to the backend
      const response = await fetch(`http://localhost:8000/api/rag/chat/${conversationId}/welcome/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: welcomeMessage })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Replace the temporary message with the one from the server
        setMessages([{
          id: data.id.toString(),
          content: data.content,
          role: data.role as MessageRole, // Ensure proper typing
          timestamp: new Date(data.timestamp)
        }]);
      }
    } catch (error) {
      // Keep the temporary message if the API call fails
      console.error('Failed to add welcome message:', error);
    }
  };

  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
    }
  }, [activeChatId, fetchMessages]); 

  const createNewConversation = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/rag/conversations/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: 'New conversation' })
      });
      
      const newConv = await response.json();
      const newChat: ChatHistory = {
        id: newConv.id.toString(),
        title: newConv.title,
        date: new Date(newConv.created_at)
      };
  
      setChatHistory(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      setMessages([]);
      setIsNewChat(false);
      inputRef.current?.focus();
    } catch (error) {
      toast.error('Failed to create conversation');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("chatAuth")
    router.push("/login")
  }

  // handle optimistic updates properly
  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || !activeChat) return

    const tempId = `temp-${Date.now()}`
    const userMessage: Message = { 
      id: tempId, 
      content: input, 
      role: "user", 
      timestamp: new Date() 
    };
    
    // Only add the user message, don't duplicate it
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setInput("");

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://localhost:8000/api/rag/chat/${activeChat.id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      })

      const data = await response.json()
      
      // Replace the temporary user message and add the assistant's response
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== tempId),
        {
          id: data.user_message.id.toString(),
          content: data.user_message.content,
          role: data.user_message.role as MessageRole,
          timestamp: new Date(data.user_message.timestamp)
        },
        {
          id: data.assistant_message.id.toString(),
          content: data.assistant_message.content,
          role: data.assistant_message.role as MessageRole,
          timestamp: new Date(data.assistant_message.timestamp)
        }
      ]);
    } catch (error) {
      // Remove the temporary message if the API call fails
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      toast.error('Failed to send message')
    } finally {
      setIsTyping(false)
    }
  }, [input, activeChat])

  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewChat = () => {
    createNewConversation();
    inputRef.current?.focus();
  }

  const setActiveConversation = useCallback((id: string) => {
    setActiveChatId(id);
    fetchMessages(id);
    setIsNewChat(false);
  }, [fetchMessages]);

  useEffect(() => {
    if (initialConversationId && chatHistory.length > 0) {
      const exists = chatHistory.some(c => c.id === initialConversationId);
      if (exists && activeChatId !== initialConversationId) {
        setActiveChatId(initialConversationId);
      }
    } else if (chatHistory.length > 0 && !activeChatId) {
      setActiveChatId(chatHistory[0].id);
    }
  }, [chatHistory, initialConversationId]);

  const handleDeleteChat = useCallback(async (e: React.MouseEvent<Element, MouseEvent>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/rag/conversations/${id}/`, {
        method: 'DELETE',
        headers: {'Authorization': `Bearer ${token}`}
      });
  
      if (!response.ok) throw new Error('Delete failed');
  
      // Update chat history by removing the deleted chat
      setChatHistory(prev => prev.filter(chat => chat.id !== id));
      
      if (activeChatId === id) {
        const firstChatId = chatHistory.filter(chat => chat.id !== id)[0]?.id || null;
        
        if (firstChatId) {
          setActiveChatId(firstChatId);  // Remove updateActiveChatState call here
        } else {
          setActiveChatId(null);
          setMessages([]);
        }
      }
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  }, [activeChatId, chatHistory]);

  const handleExampleClick = (example: string) => {
    setInput(example)
    // Focus the input
    inputRef.current?.focus()
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <ChatSidebar
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onNewChat={createNewConversation}
        onSelectChat={setActiveConversation}
        onDeleteChat={handleDeleteChat} 
      />
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4 smooth-transition">
          <div className="flex items-center">
            <SidebarTrigger className="mr-2 smooth-transition hover:scale-110" />
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">Chat Assistant</h1>
              {activeChat && <p className="text-sm text-muted-foreground">{activeChat.title}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
          {userData && (
            <span className="hidden text-sm text-muted-foreground md:inline-block">
              {userData.full_name || userData.email}
            </span>
          )}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Logout"
              className="smooth-transition hover:scale-110"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-background dark:bg-background">
        {isNewChat ? (
          <div className="pt-8 pb-4 px-4">
            <div className="flex justify-center mb-8">
              <div className="flex flex-col items-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600 text-white">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Chat Assistant</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
              {/* Examples */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600 text-white">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium">Examples</h3>
                </div>
                <div className="space-y-2">
                  {[
                    "Explain quantum computing in simple terms",
                    "Got any creative ideas for a 10-year old's birthday?",
                    "How do I make an HTTP request in JavaScript?",
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example)}
                      className="p-3 border rounded-lg text-left text-sm hover:bg-muted/50 transition-colors w-full"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Capabilities */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600 text-white">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium">Capabilities</h3>
                </div>
                <div className="space-y-2">
                  {[
                    "Remembers what user said earlier in the conversation",
                    "Allows user to provide follow-up corrections",
                    "Trained to decline inappropriate requests",
                  ].map((capability, index) => (
                    <div key={index} className="p-3 border rounded-lg text-sm">
                      {capability}
                    </div>
                  ))}
                </div>
              </div>

              {/* Limitations */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600 text-white">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium">Limitations</h3>
                </div>
                <div className="space-y-2">
                  {[
                    "May occasionally generate incorrect information",
                    "May occasionally produce harmful instructions or biased content",
                    "Limited knowledge of world and events after 2021",
                  ].map((limitation, index) => (
                    <div key={index} className="p-3 border rounded-lg text-sm">
                      {limitation}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <ChatMessage message={message} />
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <div className="py-6 px-4 border-b border-border/30 bg-muted/20">
                <div className="max-w-3xl mx-auto flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20 text-foreground dark:bg-muted-foreground/30">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium">Assistant</p>
                    </div>
                    <div className="mt-2">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"></div>
                        <div
                          className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>


        <div className="sticky bottom-0 border-t bg-background p-4 smooth-transition">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-3 text-muted-foreground hover:text-foreground smooth-transition"
              >
                <Mic className="h-5 w-5" />
                <span className="sr-only">Voice input</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-12 text-muted-foreground hover:text-foreground smooth-transition"
              >
                <Image className="h-5 w-5" />
                <span className="sr-only">Upload image</span>
              </Button>

              <Input
                ref={inputRef}
                id="message-input"
                className="pl-24 pr-12 py-6 rounded-full border bg-background smooth-transition focus:scale-[1.01]"
                placeholder="Type message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
              />

              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!input.trim() || isTyping}
                className="absolute right-3 smooth-transition hover:scale-110 pulse-on-hover"
                variant="ghost"
              >
                <Send className={`h-5 w-5 ${input.trim() && !isTyping ? "text-primary" : "text-muted-foreground"}`} />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>

        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  )
}