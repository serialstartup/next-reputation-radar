"use client"

import { AppHeader } from "@/components/app-header"
import { ReportPreview, ReportPreviewSkeleton } from "@/components/report-preview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockNotificationSettings, mockWeeklyReport } from "@/lib/mock-data"
import type { NotificationSettings } from "@/lib/types"
import { useEffect, useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function AlertsPage() {
  const [settings, setSettingsLocal] = useLocalStorage<NotificationSettings>(
    "rr_notification_settings",
    mockNotificationSettings
  )
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  // whenever settings change locally (Switches), hide saved badge
  useEffect(() => {
    setSaved(false)
  }, [settings])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  const setField = (k: keyof NotificationSettings, v: boolean) =>
    setSettingsLocal({ ...settings, [k]: v })

  const saveAll = () => {
    setSettingsLocal(settings)
    setSaved(true)
  }
  return (
    <>
      <AppHeader title="Alerts & Reports" description="Configure notifications and view reports" />

      <div className="p-4">
        {/* Actions */}
        <div className="mb-3 flex items-center justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            Export PDF
          </Button>
          <Button size="sm" onClick={saveAll}>Save All Changes</Button>
          {saved && (
            <Badge variant="secondary" className="text-[10px]">Saved</Badge>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Notification Settings */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Alert Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Urgent Negative Review Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified instantly when a review below 3 stars is posted
                    </p>
                  </div>
                  <Switch
                    checked={settings.negative_review_alert}
                    onCheckedChange={(v) => setField("negative_review_alert", v)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Weekly Performance Summary</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive a consolidated report every Monday at 8:00 AM
                    </p>
                  </div>
                  <Switch
                    checked={settings.weekly_report}
                    onCheckedChange={(v) => setField("weekly_report", v)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Monthly Insights Deep Dive</Label>
                    <p className="text-xs text-muted-foreground">
                      Comprehensive analysis of long-term sentiment trends
                    </p>
                  </div>
                  <Switch
                    checked={settings.competitor_change}
                    onCheckedChange={(v) => setField("competitor_change", v)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Delivery Channels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs">Email</Label>
                    <p className="text-xs text-muted-foreground">
                      Send alerts to your email address
                    </p>
                  </div>
                  <Switch
                    checked={settings.email}
                    onCheckedChange={(v) => setField("email", v)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <Label className="text-xs">SMS</Label>
                      <p className="text-xs text-muted-foreground">Send alerts via text message</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">Pro</Badge>
                  </div>
                  <Switch
                    checked={false}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Report Preview */}
          <div data-print="report">
            <h2 className="text-sm font-semibold mb-3">Latest Report Preview</h2>
            {loading ? (
              <ReportPreviewSkeleton />
            ) : (
              <ReportPreview report={mockWeeklyReport} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
