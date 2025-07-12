import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import FadeLink from "@/components/FadeLink"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forecast Not Found</h1>
            <p className="text-gray-600 mb-6">The requested forecast could not be found.</p>
            <FadeLink href="/">
              <Button>Return Home</Button>
            </FadeLink>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
