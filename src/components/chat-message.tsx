"use client"

import { formatDistanceToNow } from "date-fns"
import { User, Bot, Copy, ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [displayContent, setDisplayContent] = useState(message.content)
  const isUser = message.role === "user"
  const [liked, setLiked] = useState<boolean | null>(null)

  // Sync content changes from parent
  useEffect(() => {
    setDisplayContent(message.content)
  }, [message.content])

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    toast.success("Message content copied to clipboard")
  }

  const handleFeedback = (isPositive: boolean) => {
    setLiked(isPositive)
    toast.success(
      isPositive ? "Thanks for positive feedback!" : "We'll improve based on your feedback"
    )
  }

  return (
    <div className={cn(
      "py-6 px-4 border-b border-border/30",
      isUser ? "bg-background" : "bg-muted/20"
    )}>
      <div className="max-w-3xl mx-auto flex gap-4">
        <div className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" 
                 : "bg-muted-foreground/20 dark:bg-muted-foreground/30 text-foreground"
        )}>
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{isUser ? "You" : "Assistant"}</p>
            <time className="text-xs text-muted-foreground">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </time>
          </div>
          
          <div className="text-sm leading-relaxed whitespace-pre-wrap min-h-[24px]">
            {displayContent ? displayContent : (
              <div className="flex space-x-2 items-center h-6">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" 
                     style={{ animationDelay: "0.2s" }} />
                <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" 
                     style={{ animationDelay: "0.4s" }} />
              </div>
            )}
          </div>
        </div>

        {!isUser && (
          <div className="flex items-start gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Copy message</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      liked === true && "text-primary",
                      liked !== true && "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => handleFeedback(true)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="sr-only">Like</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Like message</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      liked === false && "text-destructive",
                      liked !== false && "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => handleFeedback(false)}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="sr-only">Dislike</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Dislike message</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  )
}