"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Loader2, Trash2, Key, Bell, User, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [profile, setProfile] = useState({ name: "Acme Café", email: "john@acmecafe.com" })
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [notifications, setNotifications] = useState({
    email_alerts: true,
    weekly_digest: true,
    negative_review_alerts: true,
    marketing_emails: false,
  })

  const handleSaveProfile = async () => {
    setLoading(true)
    setMessage(null)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        email: profile.email,
        data: { full_name: profile.name },
      })
      
      if (error) throw error
      setMessage({ type: "success", text: "Profile updated successfully" })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to update" })
    }
    
    setLoading(false)
  }

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }
    
    if (passwords.new.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" })
      return
    }

    setLoading(true)
    setMessage(null)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      })
      
      if (error) throw error
      setMessage({ type: "success", text: "Password changed successfully" })
      setPasswords({ current: "", new: "", confirm: "" })
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to change password" })
    }
    
    setLoading(false)
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    
    try {
      // Note: This requires Supabase admin privileges or proper setup
      const supabase = createClient()
      const { error } = await supabase.auth.admin.deleteUser((await supabase.auth.getUser()).data.user?.id || "")
      
      if (error) throw error
      window.location.href = "/login"
    } catch (error) {
      setMessage({ type: "error", text: "Please contact support to delete your account" })
    }
    
    setLoading(false)
  }

  return (
    <>
      <AppHeader title="Settings" description="Manage your account" />

      <div className="p-4 max-w-2xl space-y-4">
        {message && (
          <div className={`p-3 rounded-md text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
            {message.text}
          </div>
        )}

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs">Business Name</Label>
                <Input
                  id="name"
                  className="text-xs"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="text-xs"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
            </div>
            <Button size="sm" onClick={handleSaveProfile} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Key className="h-4 w-4" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-xs">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                className="text-xs"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-xs">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  className="text-xs"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-xs">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="text-xs"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
            </div>
            <Button size="sm" onClick={handleChangePassword} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs">Email Alerts</Label>
                <p className="text-xs text-muted-foreground">Receive important alerts via email</p>
              </div>
              <Switch
                checked={notifications.email_alerts}
                onCheckedChange={(v) => setNotifications({ ...notifications, email_alerts: v })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs">Weekly Digest</Label>
                <p className="text-xs text-muted-foreground">Receive weekly summary emails</p>
              </div>
              <Switch
                checked={notifications.weekly_digest}
                onCheckedChange={(v) => setNotifications({ ...notifications, weekly_digest: v })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs">Negative Review Alerts</Label>
                <p className="text-xs text-muted-foreground">Instant alerts for 1-2 star reviews</p>
              </div>
              <Switch
                checked={notifications.negative_review_alerts}
                onCheckedChange={(v) => setNotifications({ ...notifications, negative_review_alerts: v })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs">Marketing Emails</Label>
                <p className="text-xs text-muted-foreground">Product updates and promotions</p>
              </div>
              <Switch
                checked={notifications.marketing_emails}
                onCheckedChange={(v) => setNotifications({ ...notifications, marketing_emails: v })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Plan Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Plan
              </CardTitle>
              <Badge>Free</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              You're on the Free plan. Upgrade to unlock competitor analysis,
              AI-powered insights, and more.
            </p>
            <Button className="mt-3" size="sm">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-sm text-destructive flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers. This includes all reviews,
                    sources, and analytics data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
