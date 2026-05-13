"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/custom/button/button-component";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { AccountSettingsSkeletonV1 as AccountSettingsSkeleton } from "@/components/custom/skeleton/profileSkeleton";
import { DbProfile } from "@/lib/types"; // Adjust based on your types location
import { toast } from "sonner"; // Or your preferred toast library

export function AccountSettingsPage() {
  const [user, setUser] = useState<DbProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    province: "",
    city: "",
    barangay: "",
  });

  // FETCHING OF DATA
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/data/currentUser");
        const result = await res.json();
        if (result.success) {
          const data = result.data;
          setUser(data);
          // Initialize form values
          setFormData({
            full_name: data.full_name || "",
            phone: data.phone || "",
            province: data.province || "",
            city: data.city || "",
            barangay: data.barangay || "",
          });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // UPDATE USER PROFILE HANDLER
  const updateProfileHandler = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/data/updateProfile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setUser(result.data);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("A network error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  if (loading || !user) return <AccountSettingsSkeleton />;

  const initials = formData.full_name
    ? formData.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.avatar_url ?? undefined} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            Change Photo
          </Button>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Location</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="province">Province</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="barangay">Barangay</Label>
              <Input
                id="barangay"
                value={formData.barangay}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button loading={isSaving} onClick={updateProfileHandler}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountSettingsPage;
