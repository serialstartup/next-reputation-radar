"use client"

import { OnboardingProgress } from "@/components/onboarding-progress"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, BarChart3, MessageSquare, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OnboardingStep1() {
  const router = useRouter()

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <OnboardingProgress currentStep={1} totalSteps={3} />
      </div>

      <div className="text-center">
        <h1 className="text-xl font-semibold">Welcome to Reputation Radar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Let's set up your business in just a few steps.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Collect Reviews</h3>
              <p className="text-xs text-muted-foreground">
                Connect Google, Instagram and more to automatically gather reviews.
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">AI Insights</h3>
              <p className="text-xs text-muted-foreground">
                Get AI-powered analysis of what customers love and complain about.
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Beat Competitors</h3>
              <p className="text-xs text-muted-foreground">
                See how you compare to competitors and find opportunities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium mb-4">What kind of business do you run?</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Restaurant / Cafe",
              "Retail Store",
              "Hotel / Hospitality",
              "Healthcare / Clinic",
              "Salon / Beauty",
              "Professional Services",
            ].map((type) => (
              <Button key={type} variant="outline" className="justify-start">
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={() => router.push("/onboarding/step-2")}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
