"use client"

import { OnboardingProgress } from "@/components/onboarding-progress"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, MessageSquareText, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

const goals = [
  {
    id: "improve-rating",
    icon: TrendingUp,
    title: "Improve My Rating",
    description: "Track and improve your average rating across platforms",
  },
  {
    id: "manage-reviews",
    icon: MessageSquareText,
    title: "Manage Reviews",
    description: "Stay on top of reviews and respond faster",
  },
  {
    id: "beat-competitors",
    icon: Users,
    title: "Beat Competitors",
    description: "Understand your competitive positioning",
  },
]

export default function OnboardingStep1() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <OnboardingProgress currentStep={1} totalSteps={3} />
      </div>

      <div className="text-center">
        <h1 className="text-xl font-semibold">What&apos;s your main goal?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This helps us customize your dashboard experience.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={cn(
              "cursor-pointer transition-colors hover:border-primary/50",
              selected === goal.id && "border-primary ring-1 ring-primary"
            )}
            onClick={() => setSelected(goal.id)}
          >
            <CardContent className="p-4 text-center">
              <goal.icon className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-3 text-sm font-medium">{goal.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{goal.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          disabled={!selected}
          onClick={() => router.push("/onboarding/step-2")}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
