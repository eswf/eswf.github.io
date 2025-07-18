"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => router.back()}
      className="transition-colors duration-300 rounded-full"
    >
      <ChevronLeft className="h-[1.2rem] w-[1.2rem] rotate-0 transition-all duration-300" />
    </Button>

  )
}
