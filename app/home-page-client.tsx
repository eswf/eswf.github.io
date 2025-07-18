'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertTriangle, Clock, Gem, History } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import type { Forecast } from "@/lib/forecasts"
import { useEffect, useRef, useState } from "react"
import { ModeToggle } from "@/components/ui/theme-toggle"
import FadeLink from "@/components/FadeLink"
import { useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const threatLevelColors = {
  Marginal: "bg-green-100 text-green-800 border-green-200",
  Slight: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Enhanced: "bg-orange-100 text-orange-800 border-orange-200",
  Moderate: "bg-red-100 text-red-800 border-red-200",
  "High": "bg-purple-100 text-purple-800 border-purple-200",
}

const threatLevelColorsDark = {
  Marginal: "bg-green-900 text-green-200 border-green-700",
  Slight: "bg-yellow-900 text-yellow-200 border-yellow-700",
  Enhanced: "bg-orange-900 text-orange-200 border-orange-700",
  Moderate: "bg-red-900 text-red-200 border-red-700",
  "High": "bg-purple-900 text-purple-200 border-purple-700",
}

const threatLevelTextColors = {
  Marginal: "text-green-500 dark:text-green-1100",
  Slight: "text-yellow-500 dark:text-yellow-1100",
  Enhanced: "text-orange-500 dark:text-orange-1100",
  Moderate: "text-red-500 dark:text-red-1100",
  "High": "text-purple-500 dark:text-purple-1100",
}

const threatLevelHoverColors = {
  Marginal: "hover:border-green-400",
  Slight: "hover:border-yellow-400",
  Enhanced: "hover:border-orange-400",
  Moderate: "hover:border-red-400",
  "High": "hover:border-purple-400",
};

const threatLevelHoverColorsDark = {
  Marginal: "hover:border-green-800",
  Slight: "hover:border-yellow-800",
  Enhanced: "hover:border-orange-800",
  Moderate: "hover:border-red-800",
  "High": "hover:border-purple-800",
};


export default function HomePageClient({ todaysForecast, previousForecasts, futureForecasts }: { todaysForecast: Forecast | null, previousForecasts: Forecast[], futureForecasts: Forecast[] }) {
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
      urlThreatLevel !== "All" && // <-- add this condition
      forecastHistoryRef.current &&
      !hasScrolledRef.current
    ) {
      hasScrolledRef.current = true
      setTimeout(() => {
        forecastHistoryRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 300)
    }
  }, [mounted, urlThreatLevel])

  if (!mounted) {
    return null
  }

  const colors = theme === 'dark' ? threatLevelColorsDark : threatLevelColors
  const textColors = threatLevelTextColors;
  const hoverColors = theme === "dark" ? threatLevelHoverColorsDark : threatLevelHoverColors;

  return (
    <div className="min-h-screen bg-background animate-fadeAndOpacity">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            All provided weather outlooks are for informational purposes only. For official warnings and updates, please follow your local meteorological agency or government weather service.
          </p>
          <br />
          <h1 className="text-5xl font-bold text-primary mb-2">European Severe Weather Forecast</h1>
          <p className="text-1x1 text-foreground">Amateur weather forecasting and threat assessment</p>
        </div>

        {/* Today's Forecast */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold dark:text-white text-black mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Today's Forecast
          </h2>

          {todaysForecast ? (
            <FadeLink href={`/forecast/${todaysForecast.id}`}>
              <Card className={`hover:shadow-lg transition-shadow cursor-pointer border-2 transition-colors duration-250 ${hoverColors[todaysForecast.threatLevel as keyof typeof hoverColors]}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div> 
                      <CardTitle className={`text-xl font-bold ${textColors[todaysForecast.threatLevel as keyof typeof textColors]}`}>{todaysForecast.name}</CardTitle>
                      <p className="text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {todaysForecast.period}
                      </p>
                    </div>
                    <Badge className={colors[todaysForecast.threatLevel as keyof typeof colors]}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {todaysForecast.threatLevel}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                    <div className="aspect-video relative rounded-lg overflow-hidden">
                      <Image
                        src={todaysForecast.mapImage || "/placeholder.svg"}
                        alt={`${todaysForecast.name} forecast map`}
                        fill
                        className="object-cover"
                      />
                    </div>
                </CardContent>
              </Card>
            </FadeLink>
          ) : (
            <Card className="border-dashed border-2 border-primary">
              <CardContent className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No forecast available for today</h3>
                <p className="text-muted-foreground">Check back later for updated forecasts.</p>
              </CardContent>
            </Card>
          )}
          <br />
          <p className="text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            We are unable to provide daily updates or services. Please refer to official sources for the most current and reliable weather information.
          </p>
        </div>

        {/* Forecast Future */}
        <div>
          {futureForecasts.length > 0 ? (
            <><h2 className="text-2xl font-bold dark:text-white text-black mb-6 flex items-center gap-2">
              <Gem className="h-6 w-6" />
              Upcoming Forecasts
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {futureForecasts.map((forecast) => (
                <FadeLink key={forecast.id} href={`/forecast/${forecast.id}`}>
                  <Card className={`hover:shadow-lg transition-shadow cursor-pointer border-2 transition-colors duration-250 ${hoverColors[forecast.threatLevel as keyof typeof hoverColors]}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className={`text-xl ${textColors[forecast.threatLevel as keyof typeof textColors]}`}>{forecast.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {forecast.id}
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
                          alt={`${forecast.name} forecast map`}
                          fill
                          className="object-cover" />
                      </div>
                    </CardContent>
                  </Card>
                </FadeLink>
              ))}
            </div></>
          ) : (
            <div></div>
          )}
        </div>

        <br/>

        {/* Forecast History */}
        
        <div ref={forecastHistoryRef}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-white text-black flex items-center gap-2">
              <History className="h-6 w-6" />
              Forecast History
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

          {previousForecasts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {previousForecasts
                .filter((forecast) => selectedThreat === "All" || forecast.threatLevel === selectedThreat)
                .map((forecast) => (
                <FadeLink key={forecast.id} href={`/forecast/${forecast.id}`}>
                  <Card className={`hover:shadow-lg transition-shadow cursor-pointer border-2 transition-colors duration-250 ${hoverColors[forecast.threatLevel as keyof typeof hoverColors]}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className={`text-xl ${textColors[forecast.threatLevel as keyof typeof textColors]}`}>{forecast.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {forecast.id}
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
                          alt={`${forecast.name} forecast map`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </FadeLink>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-primary">
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No previous forecasts available.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
