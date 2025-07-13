import { getAllForecasts, getForecastById } from "@/lib/forecasts"
import { Suspense } from "react"
import HomePageClient from "./home-page-client"

export default async function HomePage() {
  const today = new Date().toISOString().split("T")[0]

  // Await data fetching (assuming these are async functions)
  const todaysForecast = await getForecastById(today)
  const allForecasts = await getAllForecasts()

  const previousForecasts = allForecasts.filter((f) => f.id < today)
  const futureForecasts = allForecasts
    .filter((f) => f.id > today)
    .sort((a, b) => a.id.localeCompare(b.id))

  return (
    <Suspense fallback={<div>Loading forecast...</div>}>
      <HomePageClient
        todaysForecast={todaysForecast}
        previousForecasts={previousForecasts}
        futureForecasts={futureForecasts}
      />
    </Suspense>
  )
}
