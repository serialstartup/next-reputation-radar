import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <>
      <AppHeader title="Settings" description="Manage your account" />

      <div className="p-4 max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-xs">Business Name</Label>
                <Input defaultValue="Acme Café" className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input defaultValue="john@acmecafe.com" className="text-xs" />
              </div>
            </div>
            <Button size="sm">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Plan</CardTitle>
              <Badge>Free</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              You&apos;re on the Free plan. Upgrade to unlock competitor analysis,
              AI-powered insights, and more.
            </p>
            <Button className="mt-3" size="sm">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
