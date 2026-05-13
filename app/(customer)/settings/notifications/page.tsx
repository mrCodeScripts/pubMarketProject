// ─────────────────────────────────────────────────────────────────────────────
// app/(customer)/settings/notifications/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type Pref = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<Pref[]>([
    {
      id: "order_updates",
      label: "Order Updates",
      description: "Status changes for your orders",
      enabled: true,
    },
    {
      id: "promos",
      label: "Promotions",
      description: "Sales, discounts and special offers",
      enabled: true,
    },
    {
      id: "new_products",
      label: "New Products Nearby",
      description: "New listings from sellers in your area",
      enabled: false,
    },
    {
      id: "new_messages",
      label: "New Messages",
      description: "Chat messages from sellers",
      enabled: true,
    },
    {
      id: "review_replies",
      label: "Review Replies",
      description: "When sellers respond to your reviews",
      enabled: false,
    },
  ]);

  const toggle = (id: string) =>
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    );

  return (
    <Card>
      <CardContent className="p-6 space-y-1">
        <h2 className="text-base font-semibold mb-4">
          Notification Preferences
        </h2>
        {prefs.map((pref, i) => (
          <div key={pref.id}>
            <div className="flex items-center justify-between py-3">
              <div className="flex-1 pr-4">
                <Label
                  htmlFor={pref.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {pref.label}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pref.description}
                </p>
              </div>
              <Switch
                id={pref.id}
                checked={pref.enabled}
                onCheckedChange={() => toggle(pref.id)}
              />
            </div>
            {i < prefs.length - 1 && <Separator />}
          </div>
        ))}
        <div className="pt-3">
          <Button size="sm">Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}
export { NotificationSettingsPage as default };
