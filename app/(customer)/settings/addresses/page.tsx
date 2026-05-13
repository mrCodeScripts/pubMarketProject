// ─────────────────────────────────────────────────────────────────────────────
// app/(customer)/settings/addresses/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  isDefault: boolean;
};

const initial: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    fullName: "Juan dela Cruz",
    phone: "09171234567",
    street: "123 Rizal St.",
    barangay: "Poblacion",
    city: "Iligan City",
    province: "Lanao del Norte",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Work",
    fullName: "Juan dela Cruz",
    phone: "09171234567",
    street: "456 Quezon Ave.",
    barangay: "Tambacan",
    city: "Iligan City",
    province: "Lanao del Norte",
    isDefault: false,
  },
];

export function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initial);
  const setDefault = (id: string) =>
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  const remove = (id: string) =>
    setAddresses((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        <Card
          key={addr.id}
          className={addr.isDefault ? "border-pm-green-300" : ""}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {addr.label}
                    {addr.isDefault && (
                      <Badge className="text-[10px] bg-success-bg text-success-fg border-0">
                        Default
                      </Badge>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {addr.fullName} · {addr.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {addr.street}, {addr.barangay}, {addr.city}, {addr.province}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                {!addr.isDefault && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => remove(addr.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
            {!addr.isDefault && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-7 text-xs text-primary flex items-center gap-1"
                onClick={() => setDefault(addr.id)}
              >
                <Check className="w-3 h-3" /> Set as Default
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        className="w-full flex items-center gap-2 border-dashed"
      >
        <Plus className="w-4 h-4" /> Add New Address
      </Button>
    </div>
  );
}
export { AddressesPage as default };
