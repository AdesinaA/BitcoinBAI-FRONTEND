'use client'

import * as React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save } from 'lucide-react'

export function AdminSettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary md:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Platform configuration and system settings.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Platform-wide configuration options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Application Name</Label>
                <Input id="app-name" defaultValue="Bitcoin BAI" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-url">Application URL</Label>
                <Input id="app-url" defaultValue="https://bitcoin-bai.com" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable to temporarily disable public access.
                  </p>
                </div>
                <Switch id="maintenance" />
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Authentication and security configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jwt-secret">JWT Secret</Label>
                <Input id="jwt-secret" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jwt-expiry">JWT Expiry</Label>
                <Input id="jwt-expiry" defaultValue="15m" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="2fa">Two-Factor Auth</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts.
                  </p>
                </div>
                <Switch id="2fa" defaultChecked />
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Email and notification configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-from">Email From</Label>
                <Input id="email-from" defaultValue="noreply@bitcoin-bai.com" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable system email notifications.
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bitcoin">
          <Card>
            <CardHeader>
              <CardTitle>Bitcoin Settings</CardTitle>
              <CardDescription>
                Bitcoin network and wallet configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="btc-network">Bitcoin Network</Label>
                <Input id="btc-network" defaultValue="testnet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="btc-confirmations">
                  Required Confirmations
                </Label>
                <Input id="btc-confirmations" type="number" defaultValue="3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="btc-explorer">Explorer URL</Label>
                <Input id="btc-explorer" defaultValue="https://mempool.space/testnet" />
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
