import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function Hero() {
  return (
    <Card>
      <CardHeader>
        <h1 className="text-2xl font-semibold">Welcome back!</h1>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden rounded-lg bg-background">
          <div className="relative flex flex-col-reverse md:flex-row items-center justify-between gap-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome to Compaion!
              </h2>
              <p className="text-muted-foreground">
                We&apos;re here to revolutionize your savings journey. Simply upload your costs, and we&apos;ll take care of the rest.
              </p>
              <p className="text-muted-foreground">
                Our advanced algorithms and Compaion AI work tirelessly to optimize your expenses, ensuring you get the best deals without compromising on quality.
              </p>
              <p className="text-muted-foreground">
                Ready to start saving? Upload your costs now and let our AI-powered system do the heavy lifting for you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button>Upload Costs</Button>
                <Button variant="outline">Try Compaion AI</Button>
              </div>
            </div>
            <div className="relative w-full max-w-sm">
              <img
                src="/images/hero-illustration.svg"
                alt="Hero Illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
