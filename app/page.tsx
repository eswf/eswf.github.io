import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getAllForecasts, getTodaysForecast } from "@/lib/forecasts"

const threatLevelColors = {
  Marginal: "bg-green-100 text-green-800 border-green-200",
  Slight: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Enhanced: "bg-orange-100 text-orange-800 border-orange-200",
  Moderate: "bg-red-100 text-red-800 border-red-200",
  "High Risk": "bg-purple-100 text-purple-800 border-purple-200",
}

export default function HomePage() {
  const todaysForecast = getTodaysForecast()
  const allForecasts = getAllForecasts()
  const previousForecasts = allForecasts.filter((f) => f.id !== todaysForecast?.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Weather Forecast Center</h1>
          <p className="text-gray-600">Professional weather forecasting and threat assessment</p>
        </div>

        {/* Today's Forecast */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Today's Forecast
          </h2>

          {todaysForecast ? (
            <Link href={`/forecast/${todaysForecast.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-900">{todaysForecast.name}</CardTitle>
                      <p className="text-gray-600 mt-1 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {todaysForecast.period}
                      </p>
                    </div>
                    <Badge className={threatLevelColors[todaysForecast.threatLevel as keyof typeof threatLevelColors]}>
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
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No forecast available for today</h3>
                <p className="text-gray-600">Check back later for updated forecasts.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Forecast History */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Forecast History</h2>

          {previousForecasts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {previousForecasts.map((forecast) => (
                <Link key={forecast.id} href={`/forecast/${forecast.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900 line-clamp-2">{forecast.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{forecast.id}</p>
                        </div>
                        <Badge
                          className={`${threatLevelColors[forecast.threatLevel as keyof typeof threatLevelColors]} text-xs`}
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
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="text-center py-8">
                <p className="text-gray-600">No previous forecasts available.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
