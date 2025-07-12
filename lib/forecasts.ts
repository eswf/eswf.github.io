import { readFileSync, readdirSync, existsSync } from "fs"
import { join } from "path"

export interface Forecast {
  id: string
  name: string
  period: string
  threatLevel: string
  mapImage: string
  text: string
}

const forecastsDirectory = join(process.cwd(), "data", "forecasts")

export function getAllForecasts(): Forecast[] {
  if (!existsSync(forecastsDirectory)) {
    return []
  }

  const filenames = readdirSync(forecastsDirectory)
  const forecasts = filenames
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const fullPath = join(forecastsDirectory, name)
      const fileContents = readFileSync(fullPath, "utf8")
      const forecast = JSON.parse(fileContents)
      return {
        ...forecast,
        id: name.replace(/\.json$/, ""),
      }
    })
    .sort((a, b) => b.id.localeCompare(a.id)) // Sort by date descending

  return forecasts
}

export function getForecastById(id: string): Forecast | null {
  try {
    const fullPath = join(forecastsDirectory, `${id}.json`)
    if (!existsSync(fullPath)) {
      return null
    }
    const fileContents = readFileSync(fullPath, "utf8")
    const forecast = JSON.parse(fileContents)
    return {
      ...forecast,
      id,
    }
  } catch {
    return null
  }
}

export function getTodaysForecast(): Forecast | null {
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format
  return getForecastById(today)
}
