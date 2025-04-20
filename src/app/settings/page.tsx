"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HelpCircle, Info, Key, LogOut, Moon, Save, Sun, User, Sparkles, Zap, Shield, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { AppLayout } from "@/components/app-layout"
import { Input } from "@/components/ui/input"
import { Label as UILabel } from "@/components/ui/label"
import { AppFooter } from "@/components/app-footer"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    accessibility: {
      highContrast: false,
      reducedMotion: false,
    },
    fontSize: 16,
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)

    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem("chatSettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Failed to parse settings:", error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("chatAuth")
    router.push("/")
  }

  const saveSettings = () => {
    localStorage.setItem("chatSettings", JSON.stringify(settings))
    toast.success("Your preferences have been updated.")

    // Show animation
    const saveButton = document.getElementById("save-button")
    if (saveButton) {
      saveButton.classList.add("animate-ping")
      setTimeout(() => {
        saveButton.classList.remove("animate-ping")
      }, 1000)
    }
  }

  const updateSettings = (setting: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const updateAccessibilitySettings = (setting: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [setting]: value,
      },
    }))
  }

  const handleCardHover = (id: string) => {
    setActiveCard(id)
  }

  const handleCardLeave = () => {
    setActiveCard(null)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validatePasswordForm = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
    let isValid = true

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required"
      isValid = false
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required"
      isValid = false
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters"
      isValid = false
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setPasswordErrors(errors)
    return isValid
  }

  const handleChangePassword = async () => {
    // Replace local storage code with:
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/auth/password/change/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          old_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        })
      });
  
      if (!response.ok) throw new Error('Password change failed');
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  if (!mounted) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <AppLayout>
      <div className="container w-full max-w-5xl py-8 animate-in flex flex-col min-h-screen ">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Customize your experience</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/chat")}
              className=" rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
            >
              Back to Chat
            </Button>
            <Button variant="outline" onClick={() => router.push("/chat")} className="rounded-full hover-scale">
              Cancel
            </Button>
            <Button onClick={saveSettings} id="save-button" className="rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 flex-1">
          <Card
            className={`card-hover border shadow-lg overflow-hidden transition-all duration-300 ${activeCard === "appearance" ? "scale-[1.02]" : ""}`}
            onMouseEnter={() => handleCardHover("appearance")}
            onMouseLeave={handleCardLeave}
          >
            <CardHeader className="flex flex-row items-center gap-2">
              <div className="inline-block p-2 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white">
                <Palette className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Theme Mode</Label>
              <div className="relative h-14 w-full rounded-full bg-muted p-1 flex items-center">
                <div
                  className={`absolute h-12 w-[calc(50%-0.5rem)] rounded-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-300 ${theme === "dark" ? "translate-x-[calc(100%+0.5rem)]" : "translate-x-0"}`}
                ></div>
                <button
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 h-12 rounded-full transition-colors ${
                    theme !== "dark" ? "text-white" : "text-foreground"
                  }`}
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-5 w-5" />
                  <span>Light</span>
                </button>
                <button
                  className={`relative z-10 flex-1 flex items-center justify-center gap-2 h-12 rounded-full transition-colors ${
                    theme === "dark" ? "text-white" : "text-foreground"
                  }`}
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-5 w-5" />
                  <span>Dark</span>
                </button>
              </div>
            </div>


              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Font Size</Label>
                  <span className="text-sm font-medium">{settings.fontSize}px</span>
                </div>
                <Slider
                  value={[settings.fontSize]}
                  min={12}
                  max={24}
                  step={1}
                  onValueChange={(value) => updateSettings("fontSize", value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border transition-colors">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Animations</span>
                  </div>
                  <Switch
                    checked={!settings.accessibility.reducedMotion}
                    onCheckedChange={(checked) => updateAccessibilitySettings("reducedMotion", !checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border transition-colors">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>High Contrast</span>
                  </div>
                  <Switch
                    checked={settings.accessibility.highContrast}
                    onCheckedChange={(checked) => updateAccessibilitySettings("highContrast", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`card-hover border shadow-lg overflow-hidden transition-all duration-300 ${activeCard === "security" ? "scale-[1.02]" : ""}`}
            onMouseEnter={() => handleCardHover("security")}
            onMouseLeave={handleCardLeave}
          >
            <CardHeader className="flex flex-row items-center gap-2">
              <div className="inline-block p-2 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>Manage your security settings</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div
                  className="flex items-center justify-between p-4 rounded-lg border transition-colors hover-scale cursor-pointer"
                  onClick={() => router.push("/profile")}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Account Information</div>
                      <div className="text-sm text-muted-foreground">View and update your personal information</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Change Password</div>
                      <div className="text-sm text-muted-foreground">Update your password for better security</div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="space-y-1">
                      <UILabel htmlFor="currentPassword">Current Password</UILabel>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your current password"
                      />
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-destructive">{passwordErrors.currentPassword}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <UILabel htmlFor="newPassword">New Password</UILabel>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your new password"
                      />
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <UILabel htmlFor="confirmPassword">Confirm New Password</UILabel>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm your new password"
                      />
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>

                    <Button className="w-full mt-2 inline-block p-2 bg-gradient-to-r from-primary to-purple-600 text-white" onClick={handleChangePassword} disabled={isChangingPassword}>
                      {isChangingPassword ? (
                        <span className="flex items-center gap-1">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent " />
                          Updating...
                        </span>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <AppFooter />
      </div>
    </AppLayout>
  )
}

// Simple Label component
function Label({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`text-sm font-medium ${className || ""}`} {...props}>
      {children}
    </div>
  )
}

