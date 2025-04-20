import { toast } from "@/hooks/use-toast"

export const fetcher = async (url: string) => {
  const token = localStorage.getItem('access_token')
  const response = await fetch(url, {
    headers: {'Authorization': `Bearer ${token}`}
  })
  
  if (!response.ok) {
    const error = await response.json()
    toast.error(error.detail || 'API request failed')
    throw new Error(error.detail)
  }
  
  return response.json()
}

export const handleLogout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('chatAuth')
  window.location.href = '/login'
}