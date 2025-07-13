import { getAllForecasts, getForecastById } from "@/lib/forecasts"
import HomePageClient from "./home-page-client"

export default function HomePage() {
  const today = new Date().toISOString().split("T")[0] 
  const todaysForecast = getForecastById(today)
  const allForecasts = getAllForecasts()
  const previousForecasts = allForecasts.filter((f) => f.id < today);
  const futureForecasts = allForecasts
    .filter((f) => f.id > today)
    .sort((a, b) => a.id.localeCompare(b.id));

  return <HomePageClient todaysForecast={todaysForecast} previousForecasts={previousForecasts} futureForecasts = {futureForecasts} />
}
