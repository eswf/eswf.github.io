import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { remark } from 'remark';
import html from 'remark-html';

export interface Forecast {
  id: string;
  name: string;
  period: string;
  threatLevel: string;
  mapImage: string;
  text: string; // markdown body
}

export interface UserForecast {
  id: string;
  name: string;
  date: string;
  period: string;
  threatLevel: string;
  mapImage?: string;
  text: string;
  forecaster: string;
}
const forecastsDirectory = join(process.cwd(), "data", "forecasts");
const userForecastsDirectory = join(process.cwd(), "data", "forecasts", "user");

export function getAllForecasts(): Forecast[] {
  if (!existsSync(forecastsDirectory)) return [];

  const filenames = readdirSync(forecastsDirectory);

  const forecasts = filenames
    .filter((name) => name.endsWith(".md"))
    .map((filename) => {
      const id = filename.replace(/\.md$/, "");
      const fullPath = join(forecastsDirectory, filename);
      const fileContent = readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContent);

      return {
        id,
        name: data.name ?? `Forecast for ${id}`,
        period: data.period ?? "",
        threatLevel: data.threatLevel ?? "Marginal",
        mapImage: data.mapImage ?? "/placeholder.svg",
        text: content,
      } as Forecast;
    })
    .sort((a, b) => b.id.localeCompare(a.id)); // newest first

  return forecasts;
}

export function getForecastById(id: string): Forecast | null {
  const fullPath = join(forecastsDirectory, `${id}.md`);
  if (!existsSync(fullPath)) return null;

  try {
    const fileContent = readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContent);

    return {
      id,
      name: data.name ?? `Forecast for ${id}`,
      period: data.period ?? "",
      threatLevel: data.threatLevel ?? "Marginal",
      mapImage: data.mapImage ?? "/placeholder.svg",
      text: content,
    } as Forecast;
  } catch {
    return null;
  }
}

export async function getTodaysUserForecasts(): Promise<Omit<UserForecast, 'contentHtml'>[]> {
    if (!existsSync(userForecastsDirectory)) return [];

    const today = new Date().toISOString().slice(0, 10);
    const filenames = readdirSync(userForecastsDirectory);

    const forecasts = filenames
        .filter((name) => name.startsWith(today) && name.endsWith(".md"))
        .map((filename) => {
            const id = filename.replace(/\.md$/, "");
            const fullPath = join(userForecastsDirectory, filename);
            const fileContent = readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContent);

            return {
              id,
              name: data.name ?? `Forecast for ${id}`,
              period: data.period ?? "",
              date: data.date,
              threatLevel: data.threatLevel ?? "Marginal",
              mapImage: data.mapImage ?? "/placeholder.svg",
              text: content,
              forecaster: data.forecaster,
            };
        });

    return forecasts;
}

export async function getUserForecastById(id: string): Promise<UserForecast | null> {
    const fullPath = join(userForecastsDirectory, `${id}.md`);
    if (!existsSync(fullPath)) return null;

    try {
        const fileContent = readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContent);

        const processedContent = await remark().use(html).process(content);

        return {
            id,
            name: data.name ?? `Forecast for ${id}`,
            period: data.period ?? "",
            date: data.date,
            threatLevel: data.threatLevel ?? "Marginal",
            mapImage: data.mapImage ?? "/placeholder.svg",
            text: content,
            forecaster: data.forecaster,
        };
    } catch {
        return null;
    }
}

export function getAllUserForecastIds() {
    if (!existsSync(userForecastsDirectory)) return [];
    const filenames = readdirSync(userForecastsDirectory);
    return filenames.map((filename) => {
        return {
            params: {
                id: filename.replace(/\.md$/, ""),
            },
        };
    });
}

export function getAllUserForecasts(): Omit<UserForecast, 'contentHtml'>[] {
  if (!existsSync(userForecastsDirectory)) return [];

  const filenames = readdirSync(userForecastsDirectory);

  const forecasts = filenames
    .filter((name) => name.endsWith(".md"))
    .map((filename) => {
      const id = filename.replace(/\.md$/, "");
      const fullPath = join(userForecastsDirectory, filename);
      const fileContent = readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContent);

      return {
        id,
        name: data.name ?? `Forecast for ${id}`,
        period: data.period ?? "",
        date: data.date,
        threatLevel: data.threatLevel ?? "Marginal",
        mapImage: data.mapImage ?? "/placeholder.svg",
        text: content,
        forecaster: data.forecaster,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first

  return forecasts;
}
