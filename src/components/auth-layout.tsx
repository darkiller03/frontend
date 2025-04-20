import type { ReactNode } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container flex h-full max-w-screen-lg flex-col items-center justify-center py-10 md:py-20">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6 px-4 md:px-0">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold">{title}</h2>
              <p className="text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

