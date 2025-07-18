'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertTriangle, Clock, Gem, History, User } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import type { UserForecast } from "@/lib/forecasts"
import { useEffect, useRef, useState } from "react"
import { ModeToggle } from "@/components/ui/theme-toggle"
import FadeLink from "@/components/FadeLink"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

const threatLevelColors = {
  Marginal: "bg-green-100 text-green-800 border-green-200",
  Slight: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Enhanced: "bg-orange-100 text-orange-800 border-orange-200",
  Moderate: "bg-red-100 text-red-800 border-red-200",
  High: "bg-purple-100 text-purple-800 border-purple-200",
}

const threatLevelColorsDark = {
  Marginal: "bg-green-900 text-green-200 border-green-700",
  Slight: "bg-yellow-900 text-yellow-200 border-yellow-700",
  Enhanced: "bg-orange-900 text-orange-200 border-orange-700",
  Moderate: "bg-red-900 text-red-200 border-red-700",
  High: "bg-purple-900 text-purple-200 border-purple-700",
}

const threatLevelTextColors = {
  Marginal: "text-green-500 dark:text-green-1100",
  Slight: "text-yellow-500 dark:text-yellow-1100",
  Enhanced: "text-orange-500 dark:text-orange-1100",
  Moderate: "text-red-500 dark:text-red-1100",
  High: "text-purple-500 dark:text-purple-1100",
}

const threatLevelHoverColors = {
  Marginal: "hover:border-green-400",
  Slight: "hover:border-yellow-400",
  Enhanced: "hover:border-orange-400",
  Moderate: "hover:border-red-400",
  High: "hover:border-purple-400",
}

const threatLevelHoverColorsDark = {
  Marginal: "hover:border-green-800",
  Slight: "hover:border-yellow-800",
  Enhanced: "hover:border-orange-800",
  Moderate: "hover:border-red-800",
  High: "hover:border-purple-800",
}

export default function UserOutlooksClient({
  todaysForecasts,
  previousForecasts,
  futureForecasts
}: {
  todaysForecasts: Omit<UserForecast, 'contentHtml'>[],
  previousForecasts: Omit<UserForecast, 'contentHtml'>[],
  futureForecasts: Omit<UserForecast, 'contentHtml'>[]
}) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const searchParams = useSearchParams()
  const urlThreatLevel = searchParams.get("threatLevel") || "All"
  const [selectedThreat, setSelectedThreat] = useState<string>(urlThreatLevel)
  const forecastHistoryRef = useRef<HTMLDivElement | null>(null)
  const hasScrolledRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (
      mounted &&
      urlThreatLevel &&
      urlThreatLevel !== "All" &&
      forecastHistoryRef.current &&
      !hasScrolledRef.current
    ) {
      hasScrolledRef.current = true
      setTimeout(() => {
        forecastHistoryRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 300)
    }
  }, [mounted, urlThreatLevel])

  if (!mounted) return null

  const colors = theme === 'dark' ? threatLevelColorsDark : threatLevelColors
  const textColors = threatLevelTextColors
  const hoverColors = theme === 'dark' ? threatLevelHoverColorsDark : threatLevelHoverColors

  const filteredPreviousForecasts = previousForecasts.filter(
    (forecast) => selectedThreat === "All" || forecast.threatLevel === selectedThreat
  )

  return (
    <div className="min-h-screen bg-background animate-fadeAndOpacity">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            All provided weather outlooks are for informational purposes only. For official warnings and updates, please follow your local meteorological agency or government weather service.
          </p>
          <br />
          <h1 className="text-5xl font-bold text-primary mb-2">User Submitted Outlooks</h1>
          <p className="text-1x1 text-foreground">Amateur weather forecasting and threat assessment</p>
        </div>

        {/* Today’s Outlooks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold dark:text-white text-black mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Today's Outlooks
          </h2>

          {todaysForecasts.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {todaysForecasts.map((forecast) => (
                  <CarouselItem key={forecast.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <FadeLink href={`/user-outlooks/${forecast.id}`}>
                      <Card className={`hover:shadow-lg transition-shadow cursor-pointer border-2 transition-colors duration-250 ${hoverColors[forecast.threatLevel as keyof typeof hoverColors]}`}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className={`text-xl font-bold ${textColors[forecast.threatLevel as keyof typeof textColors]}`}>{forecast.name}</CardTitle>
                              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {forecast.date}
                                <div className="flex items-center gap-1 text-muted">
                                  <User className="h-4 w-4" />
                                  <strong>{forecast.forecaster}</strong>
                                </div>
                              </p>
                            </div>
                            <Badge className={`${colors[forecast.threatLevel as keyof typeof colors]} text-xs`}>
                              {forecast.threatLevel}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="aspect-video relative rounded overflow-hidden">
                            <Image
                              src={forecast.mapImage || "/placeholder.svg"}
                              alt={`${forecast.name} map`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </FadeLink>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious></CarouselPrevious>
              <CarouselNext></CarouselNext>
            </Carousel>
          ) : (
              <Card className="border-dashed border-2 border-primary">
                <CardContent className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No forecast available for today</h3>
                  <p className="text-muted-foreground">Check back later for updated forecasts.</p>
                </CardContent>
              </Card>
          )}
        </div>

        {/* Future Outlooks */}
        {futureForecasts.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold dark:text-white text-black mb-6 flex items-center gap-2">
              <Gem className="h-6 w-6" />
              Upcoming Outlooks
            </h2>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {futureForecasts.map((forecast) => (
                  <CarouselItem key={forecast.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <FadeLink href={`/user-outlooks/${forecast.id}`}>
                      <Card className={`hover:shadow-lg transition-shadow cursor-pointer border-2 transition-colors duration-250 ${hoverColors[forecast.threatLevel as keyof typeof hoverColors]}`}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <CardTitle className={`text-xl ${textColors[forecast.threatLevel as keyof typeof textColors]}`}>{forecast.name}</CardTitle>
                              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {forecast.date}
                                <div className="flex items-center gap-1 text-muted">
                                  <User className="h-4 w-4" />
                                  <strong>{forecast.forecaster}</strong>
                                </div>
                              </p>
                            </div>
                            <Badge className={`${colors[forecast.threatLevel as keyof typeof colors]} text-xs`}>
                              {forecast.threatLevel}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="aspect-video relative rounded overflow-hidden">
                            <Image
                              src={forecast.mapImage || "/placeholder.svg"}
                              alt={`${forecast.name} map`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </FadeLink>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </>
        ) : (
          // If no future forecasts, display nothing for this section
          null
        )}

        <br />

        {/* Previous Outlooks */}
        <div ref={forecastHistoryRef}>
          {previousForecasts.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold dark:text-white text-black flex items-center gap-2">
                  <History className="h-6 w-6" />
                  Previous Outlooks
                </h2>
                <Select value={selectedThreat} onValueChange={setSelectedThreat}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by threat level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Marginal">Marginal</SelectItem>
                    <SelectItem value="Slight">Slight</SelectItem>
                    <SelectItem value="Enhanced">Enhanced</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPreviousForecasts.map((forecast) => (
                  <FadeLink key={forecast.id} href={`/user-outlooks/${forecast.id}`}>
                    <Card className={`hover:shadow-lg transition-shadow cursor-pointer border-2 transition-colors duration-250 ${hoverColors[forecast.threatLevel as keyof typeof hoverColors]}`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className={`text-xl ${textColors[forecast.threatLevel as keyof typeof textColors]}`}>{forecast.name}</CardTitle>
                            <p className="text-muted-foreground mt-2 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {forecast.date}
                              <div className="flex items-center gap-1 text-muted">
                                <User className="h-4 w-4" />
                                <strong>{forecast.forecaster}</strong>
                              </div>
                            </p>
                          </div>
                          <Badge
                            className={`${colors[forecast.threatLevel as keyof typeof colors]} text-xs`}
                          >
                            {forecast.threatLevel}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="aspect-video relative rounded overflow-hidden">
                          <Image
                            src={forecast.mapImage || "/placeholder.svg"}
                            alt={`${forecast.name} map`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </FadeLink>
                ))}
              </div>
            </>
          ) : (
            // If no previous forecasts, display nothing for this section
            null
          )}
        </div>
      </div>
    </div>
  )
}
