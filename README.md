# Weather Forecast Center

A static weather forecast website built with Next.js, designed for GitHub Pages hosting.

## Features

- **Today's Forecast**: Automatically displays the current day's forecast
- **Forecast History**: Browse all previous forecasts
- **Individual Forecast Pages**: Detailed view for each forecast
- **Mobile-Friendly**: Responsive design that works on all devices
- **Static Site**: No backend required, perfect for GitHub Pages

## Data Structure

Each forecast is stored as a JSON file in `/data/forecasts/` with the filename format `YYYY-MM-DD.json`.

### Forecast File Format

\`\`\`json
{
  "name": "Forecast Name",
  "period": "Date range description",
  "threatLevel": "Marginal|Slight|Enhanced|Moderate|High",
  "mapImage": "/path/to/image.jpg",
  "text": "Detailed forecast text with \\n for line breaks"
}
\`\`\`

## Adding New Forecasts

1. Create a new JSON file in `/data/forecasts/` named with the forecast date (e.g., `2025-01-15.json`)
2. Add the forecast map image to `/public/images/forecasts/`
3. Update the `mapImage` path in the JSON file
4. The site will automatically generate the new forecast page

## Deployment to GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings > Pages in your GitHub repository
3. Select "GitHub Actions" as the source
4. The site will automatically build and deploy when you push changes

## Local Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000` to view the site locally.

## File Structure

\`\`\`
├── app/
│   ├── page.tsx              # Homepage
│   ├── forecast/[id]/page.tsx # Individual forecast pages
│   └── layout.tsx            # Site layout
├── data/
│   └── forecasts/            # Forecast JSON files
│       ├── 2025-01-11.json
│       ├── 2025-01-10.json
│       └── ...
├── public/
│   └── images/
│       └── forecasts/        # Forecast map images
└── lib/
    └── forecasts.ts          # Forecast data utilities
\`\`\`

## Threat Levels

- **Marginal**: Green - Minimal threat
- **Slight**: Yellow - Low threat  
- **Enhanced**: Orange - Moderate threat
- **Moderate**: Red - High threat
- **High**: Purple - Extreme threat
