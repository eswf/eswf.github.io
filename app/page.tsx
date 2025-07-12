import { getAllForecasts, getTodaysForecast } from "@/lib/forecasts"
import HomePageClient from "./home-page-client"

export default function HomePage() {
  const todaysForecast = getTodaysForecast()
  const allForecasts = getAllForecasts()
  const previousForecasts = allForecasts.filter((f) => f.id !== todaysForecast?.id)

  return <HomePageClient todaysForecast={todaysForecast} previousForecasts={previousForecasts} />
}
