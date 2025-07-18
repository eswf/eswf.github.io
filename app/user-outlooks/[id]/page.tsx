import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertTriangle, Map, ReceiptText, User } from "lucide-react"
import Image from "next/image"
import { getAllUserOutlooks, getUserOutlookById } from "@/lib/user-outlooks"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import FadeLink from "@/components/FadeLink"

const threatLevelTextColors = {
  Marginal: "text-green-500 dark:text-green-1100",
  Slight: "text-yellow-500 dark:text-yellow-1100",
  Enhanced: "text-orange-500 dark:text-orange-1100",
  Moderate: "text-red-500 dark:text-red-1100",
  "High": "text-purple-500 dark:text-purple-1100",
}


// Use semantic Tailwind classes instead of hardcoded colors
const threatLevelColors = {
  Marginal: "bg-green-100 text-green-900 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700",
  Slight: "bg-yellow-100 text-yellow-900 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700",
  Enhanced: "bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-900 dark:text-orange-100 dark:border-orange-700",
  Moderate: "bg-red-100 text-red-900 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700",
  "High": "bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-700",
}

interface PageProps {
  params: { id: string };
}

export default async function UserOutlookPage({ params }: PageProps) {
  const { id } = params;
  const outlook = getUserOutlookById(id);

  if (!outlook) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground motion-safe:animate-fadeAndOpacity">
      <div className="container mx-auto px-4 py-8">
        {/* Outlook Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <CardTitle className={`text-3xl font-bold mb-2 ${threatLevelTextColors[outlook.threatLevel as keyof typeof threatLevelTextColors]}`}>
                  {outlook.title}
                </CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{outlook.id}</span>
                  </div>
                  <br></br>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{outlook.period}</span>
                  </div>
                  <br></br>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Submited by: 
                    <strong className="text-primary">{outlook.forecaster}</strong>
                  </div>
                </div>
              </div>

              <FadeLink href={`/user-outlooks/?threatLevel=${outlook.threatLevel}`}>
                <Badge
                  className={`${threatLevelColors[outlook.threatLevel as keyof typeof threatLevelColors]} 
      text-lg px-4 py-2 cursor-pointer 
      transition-shadow duration-300 ease-in-out 
      hover:shadow-lg hover:brightness-105`}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {outlook.threatLevel}
                </Badge>
              </FadeLink>
            </div>
          </CardHeader>
        </Card>

        {/* Outlook Map */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold dark:text-white text-black flex items-center gap-2">
              <Map className="h-6 w-6" />
              Forecast Map
            </h2>
          </CardHeader>
          <CardContent>
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={outlook.mapImage || "/placeholder.svg"}
                alt={`${outlook.title} forecast map`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* Outlook Text */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl dark:text-white font-bold text-black flex items-center gap-2">
              <ReceiptText className="h-6 w-6" />
              Forecast Details
            </h2>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none text-muted-white">
              <ReactMarkdown>
                {outlook.text}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
        <br />
        <p className="text-muted-foreground flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Areas shown outside Central Europe are only rough estimates and may not accurately reflect the true severe weather risk.
        </p>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const outlooks = getAllUserOutlooks()
  return outlooks.map((outlook) => ({
    id: outlook.id,
  }))
}
