"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Edit, User, X, Award, Calendar, MapPin, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { AppLayout } from "@/components/app-layout"
import { AppFooter } from "@/components/app-footer"

type UserData = {
  full_name: string
  email: string
  isAuthenticated: boolean
  joinedDate?: string
  totalConversations: number
  totalMessages: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<Partial<UserData>>({})
  const [isLoading, setIsLoading] = useState(false)

 
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/profile/', {
        headers: {'Authorization': `Bearer ${token}`}
      });
      const data = await response.json();
      setUserData({
        full_name: data.full_name,  // Direct mapping
        email: data.email,
        isAuthenticated: true,
        joinedDate: data.date_joined,
        totalConversations: data.total_conversations,
        totalMessages: data.total_messages
      });
    };
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditedData(userData || {})
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: editedData.full_name,
        })
      });
      
      if (!response.ok) throw new Error('Update failed');
      
      const updatedData = await response.json();
      
      // Update local storage
      const authData = {
        ...JSON.parse(localStorage.getItem('chatAuth') || '{}'),
        full_name: updatedData.full_name
      };
      localStorage.setItem('chatAuth', JSON.stringify(authData));
      
      // Update state
      setUserData(updatedData);
      setIsEditing(false);
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (!userData) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  const joinedDate = new Date(userData.joinedDate || Date.now())
  const formattedJoinedDate = joinedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const daysAsMember = Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24))

  // Progress bars width calculations (change these based on real max values)
  const conversationProgress = Math.min(100, (userData.totalConversations / 10) * 100)
  const messageProgress = Math.min(100, (userData.totalMessages / 50) * 100)
  const daysProgress = Math.min(100, (daysAsMember / 365) * 100)

  return (
    <AppLayout>
      <div className="container max-w-5xl py-8 animate-in flex flex-col min-h-[calc(100vh-64px)]">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <Button onClick={() => router.push("/chat")} className=" rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
            Back to Chat
          </Button>
        </div>

        <Card className="card-hover overflow-hidden border shadow-lg">
          <CardHeader className="relative">
            <div className="absolute right-6 top-6">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleEditToggle} className="rounded-full">
                    <X className="mr-1 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveProfile} disabled={isLoading} className="rounded-full">
                    {isLoading ? (
                      <span className="flex items-center gap-1">
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Check className="mr-1 h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={handleEditToggle} className="rounded-full hover-scale">
                  <Edit className="mr-1 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
            <CardTitle className="text-2xl font-bold">{userData.full_name}</CardTitle>
            <CardDescription className="flex flex-wrap gap-2 items-center">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {userData.email}
              <span className="inline-flex gap-1 items-center ml-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">Joined {formattedJoinedDate}</span>
              </span>
            </CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="bg-background">
                <Award className="h-3 w-3 mr-1 text-primary" />
                Member
              </Badge>
              <Badge className="bg-gradient-to-r from-primary to-purple-600">
                <Calendar className="h-3 w-3 mr-1" />
                Active User
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator className="h-px" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    name="full_name"
                    value={editedData.full_name || ""}
                    onChange={handleInputChange}
                    className="rounded-lg transition-all"
                  />
                ) : (
                  <p className="rounded-lg border px-3 py-2 bg-muted/30">{userData.full_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email
                </Label>
                <p className="rounded-lg border px-3 py-2 bg-muted/30 text-muted-foreground">{userData.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border shadow-lg overflow-hidden mt-6 flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="inline-block p-2 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white">
                <Award className="h-5 w-5" />
              </span>
              Account Statistics
            </CardTitle>
            <CardDescription>Your activity and usage statistics</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col items-center justify-center rounded-xl border p-6 hover-scale card-hover">
                <span className="text-4xl font-bold mb-1">{userData.totalConversations}</span>
                <span className="text-sm text-muted-foreground">Conversations</span>
                <div className="w-full h-2 bg-muted mt-2 rounded-full overflow-hidden">
                  <div className="h-full w-[40%] bg-gradient-to-r from-primary to-purple-600"></div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border p-6 hover-scale card-hover">
                <span className="text-4xl font-bold mb-1">{userData.totalMessages}</span>
                <span className="text-sm text-muted-foreground">Messages</span>
                <div className="w-full h-2 bg-muted mt-2 rounded-full overflow-hidden">
                  <div className="h-full w-[60%] bg-gradient-to-r from-primary to-purple-600"></div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border p-6 hover-scale card-hover">
                <span className="text-4xl font-bold mb-1">
                  {Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24))}
                </span>
                <span className="text-sm text-muted-foreground">Days as Member</span>
                <div className="w-full h-2 bg-muted mt-2 rounded-full overflow-hidden">
                  <div className="h-full w-[80%] bg-gradient-to-r from-primary to-purple-600"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <AppFooter />
      </div>
    </AppLayout>
  )
}

