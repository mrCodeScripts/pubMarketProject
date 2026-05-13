// ─────────────────────────────────────────────────────────────────────────────
// app/(customer)/settings/security/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function SecurityPage() {
  const [show, setShow] = useState({
    current: false,
    newP: false,
    confirm: false,
  });
  const [current, setCurrent] = useState("");
  const [newP, setNewP] = useState("");
  const [confirm, setConfirm] = useState("");
  const mismatch = confirm.length > 0 && newP !== confirm;

  const toggle = (field: keyof typeof show) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-base font-semibold">Change Password</h2>
          <div className="space-y-3">
            {[
              {
                id: "current",
                label: "Current Password",
                val: current,
                set: setCurrent,
                visible: show.current,
                key: "current" as const,
              },
              {
                id: "newP",
                label: "New Password",
                val: newP,
                set: setNewP,
                visible: show.newP,
                key: "newP" as const,
              },
              {
                id: "confirm",
                label: "Confirm New Password",
                val: confirm,
                set: setConfirm,
                visible: show.confirm,
                key: "confirm" as const,
              },
            ].map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label htmlFor={field.id}>{field.label}</Label>
                <div className="relative">
                  <Input
                    id={field.id}
                    type={field.visible ? "text" : "password"}
                    value={field.val}
                    onChange={(e) => field.set(e.target.value)}
                    className={
                      field.id === "confirm" && mismatch
                        ? "border-destructive"
                        : ""
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                    onClick={() => toggle(field.key)}
                  >
                    {field.visible ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
                {field.id === "confirm" && mismatch && (
                  <p className="text-xs text-destructive">
                    Passwords do not match
                  </p>
                )}
              </div>
            ))}
          </div>
          <Button disabled={mismatch || !current || !newP || !confirm}>
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-3">Active Sessions</h2>
          <div className="space-y-3">
            {[
              {
                device: "Chrome on Windows",
                location: "Iligan City, PH",
                current: true,
                time: "Now",
              },
              {
                device: "Mobile Safari",
                location: "Iligan City, PH",
                current: false,
                time: "2 days ago",
              },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <Badge className="text-[10px] bg-success-bg text-success-fg border-0">
                        Current
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.location} · {session.time}
                  </p>
                </div>
                {!session.current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive text-xs h-7"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export { SecurityPage as default };
