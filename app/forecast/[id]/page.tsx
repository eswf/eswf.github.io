import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getAllForecasts, getForecastById } from "@/lib/forecasts"
import { notFound } from "next/navigation"

const threatLevelColors = {
  Marginal: "bg-green-100 text-green-800 border-green-200",
  Slight: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Enhanced: "bg-orange-100 text-orange-800 border-orange-200",
  Moderate: "bg-red-100 text-red-800 border-red-200",
  "High Risk": "bg-purple-100 text-purple-800 border-purple-200",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ForecastPage({ params }: PageProps) {
  const { id } = await params
  const forecast = getForecastById(id)

  if (!forecast) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Forecast Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl text-gray-900 mb-2">{forecast.name}</CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{forecast.id}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{forecast.period}</span>
                  </div>
                </div>
              </div>
              <Badge
                className={`${threatLevelColors[forecast.threatLevel as keyof typeof threatLevelColors]} text-lg px-4 py-2`}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {forecast.threatLevel}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Forecast Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Forecast Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={forecast.mapImage || "/placeholder.svg"}
                alt={`${forecast.name} forecast map`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* Forecast Text */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Forecast Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: forecast.text.replace(/\n/g, "<br>") }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const forecasts = getAllForecasts()
  return forecasts.map((forecast) => ({
    id: forecast.id,
  }))
}
