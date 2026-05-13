"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Sparkles, X, ImagePlus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SellerLayout from "@/components/custom/layout/sellerLayout";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Vegetables",
  "Root Crops",
  "Herbs",
  "Fruits",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Baked Goods",
  "Native Delicacies",
  "Handicrafts",
  "Beverages",
  "Condiments & Spices",
  "Other",
];

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  location: string;
  status: "draft" | "published";
  images: string[];
}

interface Errors {
  [key: string]: string;
}

// Validate
function validate(d: ProductFormData): Errors {
  const e: Errors = {};
  if (!d.name.trim()) e.name = "Product name is required";
  if (!d.category) e.category = "Select a category";
  if (!d.price || isNaN(Number(d.price)) || Number(d.price) <= 0)
    e.price = "Enter a valid price";
  if (!d.stock || isNaN(Number(d.stock)) || Number(d.stock) < 0)
    e.stock = "Enter valid stock quantity";
  if (!d.description.trim()) e.description = "Description is required";
  else if (d.description.length < 20)
    e.description = "At least 20 characters required";
  return e;
}

// AI descriptions by product name keyword
const AI_DESCRIPTIONS: Record<string, string> = {
  default:
    "A fresh, high-quality product sourced locally from trusted farms in Mindanao. Harvested at peak ripeness to ensure the best flavor and nutritional value. Perfect for daily cooking and healthy meals.",
  kangkong:
    "Freshly harvested swamp cabbage from local farms in Iligan City. Tender, vibrant green leaves perfect for sautéing with garlic or adding to soups. Rich in iron and vitamins. Picked daily for maximum freshness.",
  sitaw:
    "Crisp, tender string beans harvested fresh from our farm in Hinaplanon. Perfect for pinakbet, sautéed dishes, or salads. High in fiber and vitamins A and C. Sold in generous bundles.",
  tomato:
    "Plump, vine-ripened tomatoes bursting with natural sweetness and acidity. Ideal for sauces, salads, and Filipino dishes like sinigang. Packed per kilogram for your convenience.",
  malunggay:
    "Nutrient-dense moringa leaves freshly harvested and bundled. Known as the 'miracle tree,' malunggay is packed with iron, calcium, and vitamins. Great for soups, smoothies, and everyday cooking.",
};

function getAIDescription(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, desc] of Object.entries(AI_DESCRIPTIONS)) {
    if (lower.includes(key)) return desc;
  }
  return AI_DESCRIPTIONS.default;
}

interface ProductFormProps {
  mode: "new" | "edit";
  initialData?: Partial<ProductFormData>;
  productId?: string;
}

export function ProductForm({
  mode,
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    location: "Hinaplanon, Iligan City",
    status: "draft",
    images: [],
    ...initialData,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof ProductFormData, v: string | string[]) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k as string])
      setErrors((p) => {
        const n = { ...p };
        delete n[k as string];
        return n;
      });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const previews = Array.from(files).map((f) => URL.createObjectURL(f));
    setForm((p) => ({ ...p, images: [...p.images, ...previews].slice(0, 5) }));
  };

  const removeImage = (idx: number) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  };

  const generateDescription = async () => {
    if (!form.name.trim()) {
      setErrors((p) => ({ ...p, name: "Enter a product name first" }));
      return;
    }
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    const desc = getAIDescription(form.name);
    set("description", desc);
    setGenerating(false);
  };

  const handleSave = async (publish = false) => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    if (publish) set("status", "published");
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/seller/products");
  };

  return (
    <SellerLayout title={mode === "new" ? "Add New Product" : "Edit Product"}>
      <div className="p-4 lg:p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push("/seller/products")}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {mode === "new" ? "Add New Product" : "Edit Product"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === "new"
                ? "Fill in the details to list your product."
                : `Editing: ${form.name || productId}`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Basic Info */}
          <Card className="border-border shadow-none">
            <CardHeader className="px-4 py-4 border-b border-border">
              <CardTitle className="text-sm font-semibold">
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Product Name <span className="text-pm-red-500">*</span>
                </Label>
                <Input
                  className="mt-1.5"
                  placeholder="e.g. Kangkong Bundle"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-xs text-pm-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    Category <span className="text-pm-red-500">*</span>
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => set("category", v)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs text-pm-red-500 mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Location Tag</Label>
                  <Input
                    className="mt-1.5"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="Barangay, City"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    Price (₱) <span className="text-pm-red-500">*</span>
                  </Label>
                  <Input
                    className="mt-1.5"
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                  />
                  {errors.price && (
                    <p className="text-xs text-pm-red-500 mt-1">
                      {errors.price}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Stock Quantity <span className="text-pm-red-500">*</span>
                  </Label>
                  <Input
                    className="mt-1.5"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={form.stock}
                    onChange={(e) => set("stock", e.target.value)}
                  />
                  {errors.stock && (
                    <p className="text-xs text-pm-red-500 mt-1">
                      {errors.stock}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description with AI */}
          <Card className="border-border shadow-none">
            <CardHeader className="px-4 py-4 border-b border-border flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold">
                Description
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs border-pm-green-200 text-pm-green-700 hover:bg-pm-green-50"
                onClick={generateDescription}
                disabled={generating}
              >
                {generating ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border-2 border-pm-green-300 border-t-pm-green-600 rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" /> Generate with AI
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea
                className="min-h-[120px] resize-none"
                placeholder="Describe your product — what it is, how it's grown or made, and why customers will love it..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-xs text-pm-red-500">
                    {errors.description}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-muted-foreground">
                  {form.description.length} chars
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-border shadow-none">
            <CardHeader className="px-4 py-4 border-b border-border">
              <CardTitle className="text-sm font-semibold">
                Product Images{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (up to 5)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-3">
                {form.images.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border border-border group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
                {form.images.length < 5 && (
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-pm-stone-300 hover:border-pm-green-400 hover:bg-pm-green-50 flex flex-col items-center justify-center cursor-pointer transition-all gap-1">
                    <ImagePlus className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="border-border shadow-none">
            <CardContent className="px-4 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Publish Listing
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Make this product visible to customers immediately
                </p>
              </div>
              <Switch
                checked={form.status === "published"}
                onCheckedChange={(v) =>
                  set("status", v ? "published" : "draft")
                }
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              Save as Draft
            </Button>
            <Button
              className="flex-1 sm:flex-none bg-pm-green-600 hover:bg-pm-green-700 text-white"
              onClick={() => handleSave(true)}
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : mode === "new" ? (
                "Publish Product"
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

// /seller/products/new
export default function SellerProductsNewPage() {
  return <ProductForm mode="new" />;
}
