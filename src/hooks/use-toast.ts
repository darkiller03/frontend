"use client"

// Simplified toast hook using sonner
import { toast } from "sonner"

export { toast }

export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
  }
}

