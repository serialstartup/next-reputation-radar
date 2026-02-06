"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { ReportPreview, ReportPreviewSkeleton } from "@/components/report-preview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"
import { mockNotificationSettings, mockWeeklyReport, mockKPIs } from "@/lib/mock-data"
import type { NotificationSettings, KPI } from "@/lib/types"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function AlertsPage() {
  const [settings, setSettingsLocal] = useLocalStorage<NotificationSettings>(
    "rr_notification_settings",
    mockNotificationSettings
  )
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

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

  const handleExportPDF = async () => {
    setExporting(true)
    
    try {
      // Dynamic import for PDF generation
      const { pdf } = await import("@react-pdf/renderer")
      const { PDFReport } = await import("@/components/pdf-report")
      
      const blob = await pdf(
        <PDFReport 
          report={mockWeeklyReport}
          kpis={mockKPIs as KPI[]}
          sentimentData={[]}
          businessName="Acme Café"
        />
      ).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `reputation-report-${new Date().toISOString().split("T")[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("PDF export error:", error)
      // Fallback to print
      window.print()
    }
    
    setExporting(false)
  }

  return (
    <>
      <AppHeader title="Alerts & Reports" description="Configure notifications and view reports" />

      <div className="p4">
        {/* Actions */}
        <div className="mb-3 flex items-center justify-end gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleExportPDF}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <FileDown className="mr-1 h-3 w-3" />
            )}
            Export PDF
          </Button>
          <Button size="sm" onClick={saveAll} disabled={saved}>
            Save All Changes
          </Button>
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
