'use client';

import React, { useState } from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { Heading, Text } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { updateProfileDetailsAction } from '@/app/actions/account';
import { User, Lock, Bell, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AccountSettingsPage() {
  const [formData, setFormData] = useState({
    fullName: 'Saswat Patra',
    email: 'saswat@riiqx.com',
    phone: '+91 98765 43210',
  });

  const [notifications, setNotifications] = useState({
    whatsapp: true,
    dropAlerts: true,
    newsletter: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateProfileDetailsAction(formData);
    setIsSaving(false);
    setMsg(res.message);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <AccountLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-glass-border-subtle pb-4">
          <div>
            <Heading size="2xl" font="display">
              PROFILE & SECURITY MATRIX
            </Heading>
            <Text size="xs" variant="muted" className="font-mono">
              MANAGE ACCOUNT SECURITY, DISPATCH ALERTS, AND PERSONAL TELEMETRY
            </Text>
          </div>
          <Badge variant="cyan" shape="chamfer" dot>
            AUTHENTICATED SESSION
          </Badge>
        </div>

        {msg && (
          <div className="p-3 rounded-sm bg-status-success/15 border border-status-success/40 text-status-success font-mono text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Form */}
          <div className="p-6 rounded-md bg-charcoal-matte/70 backdrop-blur-xl border border-glass-border-subtle shadow-glass-md space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-accent-cyan border-b border-glass-border-subtle pb-3 font-bold">
              <User className="w-4 h-4" />
              <span>PERSONAL DETAILS</span>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <Input
                label="FULL NAME"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />

              <Input
                label="ENCRYPTED EMAIL ADDRESS"
                type="email"
                value={formData.email}
                disabled
                helperText="Primary email locked to Supabase Auth UUID."
              />

              <Input
                label="PHONE NUMBER (FOR WHATSAPP DISPATCH)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />

              <Button type="submit" variant="primary" size="md" isLoading={isSaving} className="w-full">
                SAVE PROFILE SPEC
              </Button>
            </form>
          </div>

          {/* Notifications & Security */}
          <div className="space-y-6">
            {/* Notification Toggles */}
            <div className="p-6 rounded-md bg-charcoal-matte/70 backdrop-blur-xl border border-glass-border-subtle shadow-glass-md space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 text-accent-lime border-b border-glass-border-subtle pb-3 font-bold">
                <Bell className="w-4 h-4" />
                <span>DISPATCH ALERTS & NOTIFICATIONS</span>
              </div>

              <div className="space-y-3">
                <Switch
                  label="WHATSAPP SHIPMENT ALERTS"
                  sublabel="Receive real-time tracking links & delivery updates on WhatsApp"
                  checked={notifications.whatsapp}
                  onChange={(checked) => setNotifications({ ...notifications, whatsapp: checked })}
                />

                <Switch
                  label="DROP RELEASE NOTIFICATIONS"
                  sublabel="Get notified 15 minutes before new capsule drops go live"
                  checked={notifications.dropAlerts}
                  onChange={(checked) => setNotifications({ ...notifications, dropAlerts: checked })}
                />
              </div>
            </div>

            {/* Password Reset */}
            <div className="p-6 rounded-md bg-charcoal-matte/70 backdrop-blur-xl border border-glass-border-subtle shadow-glass-md space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-accent-crimson border-b border-glass-border-subtle pb-3 font-bold">
                <Lock className="w-4 h-4" />
                <span>SECURITY & PASSWORD</span>
              </div>

              <p className="text-riiqxText-muted text-[11px]">
                Send a passwordless magic login link to your registered email address to reset password.
              </p>

              <Button variant="outline" size="sm" className="w-full">
                SEND PASSWORD RESET LINK
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
