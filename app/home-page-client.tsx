'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, AlertTriangle, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import type { Forecast } from "@/lib/forecasts"
import { useEffect, useState } from "react"
import { ModeToggle } from "@/components/ui/theme-toggle"


const threatLevelColors = {
  Marginal: "bg-green-100 text-green-800 border-green-200",
  Slight: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Enhanced: "bg-orange-100 text-orange-800 border-orange-200",
  Moderate: "bg-red-100 text-red-800 border-red-200",
  "High Risk": "bg-purple-100 text-purple-800 border-purple-200",
}

const threatLevelColorsDark = {
  Marginal: "bg-green-900 text-green-200 border-green-700",
  Slight: "bg-yellow-900 text-yellow-200 border-yellow-700",
  Enhanced: "bg-orange-900 text-orange-200 border-orange-700",
  Moderate: "bg-red-900 text-red-200 border-red-700",
  "High Risk": "bg-purple-900 text-purple-200 border-purple-700",
}

const threatLevelTextColors = {
  Marginal: "text-green-800",
  Slight: "text-yellow-800",
  Enhanced: "text-orange-800",
  Moderate: "text-red-800",
  "High Risk": "text-purple-800",
};

const threatLevelTextColorsDark = {
  Marginal: "text-green-200",
  Slight: "text-yellow-200",
  Enhanced: "text-orange-200",
  Moderate: "text-red-200",
  "High Risk": "text-purple-200",
};

const threatLevelHoverColors = {
  Marginal: "hover:border-green-800",
  Slight: "hover:border-yellow-800",
  Enhanced: "hover:border-orange-800",
  Moderate: "hover:border-red-800",
  "High Risk": "hover:border-purple-800",
};

const threatLevelHoverColorsDark = {
  Marginal: "hover:border-green-200",
  Slight: "hover:border-yellow-200",
  Enhanced: "hover:border-orange-200",
  Moderate: "hover:border-red-200",
  "High Risk": "hover:border-purple-200",
};

export default function HomePageClient({ todaysForecast, previousForecasts }: { todaysForecast: Forecast | null, previousForecasts: Forecast[] }) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return null
  }

  const colors = theme === 'dark' ? threatLevelColorsDark : threatLevelColors
  const textColors = theme === "dark" ? threatLevelTextColorsDark : threatLevelTextColors;
  const hoverColors = theme === "dark" ? threatLevelHoverColorsDark : threatLevelHoverColors;

  return (
    <div className="min-h-screen bg-background animate-fadeAndOpacity">
      <div className="absolute top-4 right-4">
          <ModeToggle />
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary mb-2">European Severe Weather Forecast</h1>
          <p className="text-1x1 text-foreground">Professional weather forecasting and threat assessment</p>
        </div>

        {/* Today's Forecast */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Today's Forecast
          </h2>

          {todaysForecast ? (
            <Link href={`/forecast/${todaysForecast.id}`}>
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
            </Link>
          ) : (
            <Card className="border-dashed border-2 border-muted">
              <CardContent className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No forecast available for today</h3>
                <p className="text-muted-foreground">Check back later for updated forecasts.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Forecast History */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Forecast History</h2>

          {previousForecasts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {previousForecasts.map((forecast) => (
                <Link key={forecast.id} href={`/forecast/${forecast.id}`}>
                  <Card className={`hover:shadow-lg transition-shadow cursor-pointer border-2 transition-colors duration-250 ${hoverColors[forecast.threatLevel as keyof typeof hoverColors]}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="font-bold text-lg text-foreground line-clamp-2">{forecast.name}</CardTitle>
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
                </Link>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-muted">
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
