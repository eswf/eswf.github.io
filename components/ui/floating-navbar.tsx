"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "./theme-toggle"
import { ChevronLeft } from "lucide-react"
import FadeLink from "../FadeLink"


export function FloatingNavbar() {
  const pathname = usePathname()
  const userOutlooksBase = "/user-outlooks/"

  const showBackButton = (pathname.startsWith(userOutlooksBase) && pathname.length > userOutlooksBase.length) || pathname.startsWith("/forecast/");

  return (
    <div className="fixed inset-x-0 top-4 z-50 mx-auto flex max-w-fit items-center justify-center space-x-4">
      <div className="rounded-full border border-border/40 bg-background/80 px-4 py-2 shadow-lg backdrop-blur-sm flex items-center space-x-4">

        {/* Wrapper controls width and padding */}
        <div
          className={`
          flex items-center overflow-hidden
          transition-[width,padding] duration-300 ease-in-out
          ${showBackButton ? 'w-14 px-4' : 'w-0 px-0'}
        `}
        >
          {/* Button animates scale + opacity with symmetrical transitions */}
          <div
            className={`
            transition-transform transition-opacity duration-300 ease-in-out
            ${showBackButton ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'}
            origin-left
          `}
          >
            <FadeLink href="BACK">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full flex items-center justify-center flex-shrink-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </FadeLink>
          </div>
        </div>

        {/* Other buttons */}
        <FadeLink href="/">
          <Button
            variant={pathname === "/" || pathname.startsWith("/forecast/") ? "secondary" : "ghost"}
            size="sm"
            className="rounded-full hover:bg-muted flex-shrink-0 transition-colors duration-300 ease-in-out"
          >
            Official Forecasts
          </Button>
        </FadeLink>

        <FadeLink href="/user-outlooks/">
          <Button
            variant={pathname.startsWith("/user-outlooks") ? "secondary" : "ghost"}
            size="sm"
            className="rounded-full hover:bg-muted flex-shrink-0 transition-colors duration-300 ease-in-out"
          >
            User Forecasts
          </Button>
        </FadeLink>

        <ModeToggle />
      </div>
    </div>
  )
}
