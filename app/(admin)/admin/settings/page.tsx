"use client";
import { useState } from "react";
import { Store, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("PubMarket");
  const [maintenance, setMaintenance] = useState(false);
  const [autoApprove, setAutoApprove] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [approvalPolicy, setApprovalPolicy] = useState("manual");

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-bold">Platform Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage global platform configuration
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" /> General
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Platform Name</Label>
            <Input
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Platform Logo</Label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                <Store className="w-6 h-6" />
              </div>
              <Button variant="outline" size="sm">
                Upload Logo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Seller Approval</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label>Approval Policy</Label>
            <Select value={approvalPolicy} onValueChange={setApprovalPolicy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">
                  Manual Review (Admin approves each)
                </SelectItem>
                <SelectItem value="auto">
                  Auto Approve (instant, not recommended)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-approve all sellers</p>
              <p className="text-xs text-muted-foreground">
                Skip manual review for new seller applications
              </p>
            </div>
            <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">System</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Maintenance Mode</p>
              <p className="text-xs text-muted-foreground">
                Temporarily disable the platform for all users
              </p>
            </div>
            <Switch checked={maintenance} onCheckedChange={setMaintenance} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Email Notifications</p>
              <p className="text-xs text-muted-foreground">
                Send mock email alerts for orders and approvals
              </p>
            </div>
            <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
          </div>
        </CardContent>
      </Card>

      <Button className="flex items-center gap-2">
        <Save className="w-4 h-4" /> Save Settings
      </Button>
    </div>
  );
}
export { AdminSettingsPage as default };
