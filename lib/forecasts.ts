import { readFileSync, readdirSync, existsSync } from "fs"
import { join } from "path"
import matter from "gray-matter"

export interface Forecast {
  id: string
  name: string
  period: string
  threatLevel: string
  mapImage: string
  text: string // markdown body
}

const forecastsDirectory = join(process.cwd(), "data", "forecasts")

export function getAllForecasts(): Forecast[] {
  if (!existsSync(forecastsDirectory)) return []

  const filenames = readdirSync(forecastsDirectory)

  const forecasts = filenames
    .filter((name) => name.endsWith(".md"))
    .map((filename) => {
      const id = filename.replace(/\.md$/, "")
      const fullPath = join(forecastsDirectory, filename)
      const fileContent = readFileSync(fullPath, "utf8")

      const { data, content } = matter(fileContent)

      return {
        id,
        name: data.name ?? `Forecast for ${id}`,
        period: data.period ?? "",
        threatLevel: data.threatLevel ?? "Marginal",
        mapImage: data.mapImage ?? "/placeholder.svg",
        text: content,
      } as Forecast
    })
    .sort((a, b) => b.id.localeCompare(a.id)) // newest first

  return forecasts
}

export function getForecastById(id: string): Forecast | null {
  const fullPath = join(forecastsDirectory, `${id}.md`)
  if (!existsSync(fullPath)) return null

  try {
    const fileContent = readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContent)

    return {
      id,
      name: data.name ?? `Forecast for ${id}`,
      period: data.period ?? "",
      threatLevel: data.threatLevel ?? "Marginal",
      mapImage: data.mapImage ?? "/placeholder.svg",
      text: content,
    } as Forecast
  } catch {
    return null
  }
}
