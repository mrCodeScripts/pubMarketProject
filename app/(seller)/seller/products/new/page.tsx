"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  X,
  ImagePlus,
  ChevronLeft,
  MapPin,
  Tag,
  Package,
  Info,
  AlertCircle,
} from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import SellerLayout from "@/components/custom/layout/sellerLayout";
import {
  uploadProductThumbnail,
  uploadProductImages,
} from "@/lib/utils/upload-functions/upload";
import { createClient } from "@/lib/supabase/client";
import type { DbCategory } from "@/types/database";

const AI_DESCRIPTIONS: Record<string, string> = {
  default:
    "A fresh, high-quality product sourced locally. Harvested at peak ripeness to ensure the best flavor and nutrition.",
  kangkong:
    "Freshly harvested swamp cabbage from local farms. Tender, vibrant green leaves perfect for sautéing with garlic.",
  sitaw:
    "Crisp, tender string beans harvested fresh from the fields. High in fiber and vitamins, great for stir-fry or sinigang.",
  kamatis:
    "Ripe, juicy native tomatoes bursting with flavor. Freshly picked and perfect for cooking or fresh salads.",
  sayote:
    "Freshly harvested organic chayote. Mild, crisp, and versatile — perfect for tinola, stir-fry, or salads.",
};

export default function ProductFormPage() {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryLabel, setSelectedCategoryLabel] =
    useState<string>("");

  const [form, setForm] = useState({
    name: "",
    category_id: "", // UUID — what gets sent to DB
    price: "",
    stock: "",
    description: "",
    barangay: "Hinaplanon",
    city: "Iligan City",
    province: "Lanao del Norte",
    unit: "kg",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Replace the getCategories call in useEffect with:
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);

      // Fetch categories via API route instead
      const res = await fetch("/api/categories");
      const result = await res.json();
      if (result.success) setCategories(result.data);
    };
    init();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    const combined = [...imageFiles, ...newFiles].slice(0, 5);
    setImageFiles(combined);
    setImagePreviews(combined.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (idx: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== idx);
    setImageFiles(newFiles);
    setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const generateDescription = async () => {
    if (!form.name.trim()) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 600));
    const lower = form.name.toLowerCase();
    const desc =
      Object.entries(AI_DESCRIPTIONS).find(([k]) => lower.includes(k))?.[1] ??
      AI_DESCRIPTIONS.default;
    setForm((p) => ({ ...p, description: desc }));
    setGenerating(false);
  };

  const handleSave = async (publish = false) => {
    setError(null);

    if (!userId) {
      setError("You must be logged in.");
      return;
    }
    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }
    if (!form.stock && form.stock !== "0") {
      setError("Please enter available stock.");
      return;
    }

    setSaving(true);

    try {
      // 1. Create product record
      const payload = {
        name: form.name.trim(),
        slug: form.name
          .trim()
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        unit: form.unit,
        is_draft: !publish,
        is_active: publish,
        barangay: form.barangay,
        city: form.city,
        province: form.province,
        // Only include category_id if one was selected
        ...(form.category_id ? { category_id: form.category_id } : {}),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resBody = await res.json();

      if (!res.ok) {
        setError(resBody.error ?? "Failed to create product.");
        return;
      }

      const product = resBody; // this is the created DbProduct row

      // 2. Upload images if any
      if (imageFiles.length > 0) {
        const thumbRes = await uploadProductThumbnail(
          userId,
          product.id,
          imageFiles[0],
        );

        if (thumbRes.success) {
          // Update thumbnail_url on product
          await fetch(`/api/products/${product.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ thumbnail_url: thumbRes.data.url }),
          });

          // Also save to product_images as index 0
          await fetch("/api/product-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: product.id,
              url: thumbRes.data.url,
              alt_text: product.name,
              sort_order: 0,
            }),
          });
        }

        // Upload remaining gallery images
        if (imageFiles.length > 1) {
          const galleryRes = await uploadProductImages(
            userId,
            product.id,
            imageFiles.slice(1),
          );
          if (galleryRes.success) {
            // Save each to product_images
            await Promise.all(
              galleryRes.data.urls.map((url, i) =>
                fetch("/api/product-images", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    product_id: product.id,
                    url,
                    alt_text: product.name,
                    sort_order: i + 1,
                  }),
                }),
              ),
            );
          }
        }
      }

      router.push("/seller/products");
      router.refresh();
    } catch (err) {
      console.error("handleSave error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SellerLayout title="Add New Product">
      <div className="max-w-4xl mx-auto p-4 lg:p-8 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create Listing
            </h1>
            <p className="text-muted-foreground text-sm">
              Fill in the details to reach local buyers.
            </p>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-pm-green-700 font-semibold">
                <Info className="w-5 h-5" />
                <h3>General Information</h3>
              </div>
              <Card className="border-none shadow-sm">
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="What are you selling today?"
                      className="text-lg"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        onValueChange={(v) => {
                          const cat = categories.find((c) => c.id === v);
                          setForm({ ...form, category_id: v });
                          setSelectedCategoryLabel(
                            cat ? `${cat.icon} ${cat.name}` : "",
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category">
                            {selectedCategoryLabel || "Select Category"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.icon} {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select
                        defaultValue="kg"
                        onValueChange={(v) => setForm({ ...form, unit: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "kg",
                            "piece",
                            "bundle",
                            "pack",
                            "bottle",
                            "jar",
                            "box",
                            "sack",
                          ].map((u) => (
                            <SelectItem key={u} value={u}>
                              {u}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        value={`${form.barangay}, ${form.city}`}
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Description */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-pm-green-700 font-semibold">
                  <Tag className="w-5 h-5" />
                  <h3>Description</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-pm-green-600 hover:text-pm-green-700 hover:bg-pm-green-50"
                  onClick={generateDescription}
                  disabled={generating || !form.name.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {generating ? "Thinking..." : "AI Assistant"}
                </Button>
              </div>
              <Textarea
                placeholder="Describe the freshness, origin, or best use cases..."
                className="min-h-[150px] leading-relaxed shadow-sm"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </section>

            {/* Pricing & Stock */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-pm-green-700 font-semibold">
                <Package className="w-5 h-5" />
                <h3>Pricing & Stock</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Price per Unit (₱) *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Available Stock *</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Quantity"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right: Images + Actions */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-pm-green-700 font-semibold">
              <ImagePlus className="w-5 h-5" />
              <h3>Photos</h3>
            </div>
            <Card className="border-2 border-dashed bg-muted/30">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {imagePreviews.map((src, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square rounded-md overflow-hidden border bg-white"
                    >
                      <img
                        src={src}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-pm-green-600 text-[10px] text-white px-1.5 py-0.5 rounded shadow-sm">
                          Cover
                        </span>
                      )}
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="text-white w-6 h-6" />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 5 && (
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-pm-green-50 hover:border-pm-green-300 transition-colors">
                      <ImagePlus className="w-6 h-6 text-muted-foreground" />
                      <span className="text-[10px] mt-2 text-muted-foreground font-medium">
                        Add Photo
                      </span>
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
                <p className="text-[11px] text-muted-foreground text-center italic">
                  First photo is the cover. Max 5 photos.
                </p>
              </CardContent>
            </Card>

            {/* Desktop Actions */}
            <div className="hidden lg:flex flex-col gap-3 pt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSave(false)}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                className="w-full bg-pm-green-600 hover:bg-pm-green-700 text-white shadow-lg shadow-pm-green-100"
                onClick={() => handleSave(true)}
                disabled={saving}
              >
                {saving ? "Publishing..." : "List Product Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-3 shadow-2xl z-50">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => handleSave(false)}
          disabled={saving}
        >
          Draft
        </Button>
        <Button
          className="flex-[2] bg-pm-green-600 hover:bg-pm-green-700 text-white"
          onClick={() => handleSave(true)}
          disabled={saving}
        >
          {saving ? "Saving..." : "List Product"}
        </Button>
      </div>
    </SellerLayout>
  );
}
