"use client"

import { OnboardingProgress } from "@/components/onboarding-progress"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const steps = [
  "Fetching reviews from Google...",
  "Analyzing sentiment...",
  "Clustering topics...",
  "Generating insights...",
]

export default function OnboardingStep3() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setDone(true)
          return 100
        }
        const newVal = prev + 2
        setCurrentStep(Math.min(Math.floor(newVal / 25), steps.length - 1))
        return newVal
      })
    }, 80)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <OnboardingProgress currentStep={3} totalSteps={3} />
      </div>

      <div className="text-center">
        <h1 className="text-xl font-semibold">
          {done ? "You're all set!" : "Analyzing your reviews..."}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {done
            ? "Your dashboard is ready with initial insights."
            : "This usually takes a moment. Hang tight!"}
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <Progress value={progress} className="h-2" />

          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                {i < currentStep ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : i === currentStep && !done ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full border" />
                )}
                <span className="text-xs text-muted-foreground">{step}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {done && (
        <div className="flex justify-center">
          <Button onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  )
}
