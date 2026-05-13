"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Upload,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Store,
  FileText,
  X,
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
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { uploadBirDocument } from "@/lib/utils/upload-functions/upload";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";

const CATEGORIES = [
  "Fresh Produce",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Baked Goods",
  "Native Delicacies",
  "Handicrafts",
  "Beverages",
  "Condiments & Spices",
  "Other",
];

const PROVINCES = [
  "Lanao del Norte",
  "Lanao del Sur",
  "Misamis Oriental",
  "Misamis Occidental",
  "Bukidnon",
  "Cotabato",
  "Davao del Norte",
  "Davao del Sur",
];

const STEPS = [
  { id: 1, label: "Business Info", icon: Building2 },
  { id: 2, label: "BIR Document", icon: FileText },
  { id: 3, label: "Review", icon: CheckCircle2 },
];

interface FormData {
  shopName: string;
  description: string;
  category: string;
  province: string;
  city: string;
  barangay: string;
  fullAddress: string;
  birFile: File | null;
  birPreview: string | null;
  birTin: string;
}

const INITIAL: FormData = {
  shopName: "",
  description: "",
  category: "",
  province: "",
  city: "",
  barangay: "",
  fullAddress: "",
  birFile: null,
  birPreview: null,
  birTin: "",
};

interface Errors {
  [key: string]: string;
}

export default function SellerApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const validateStep1 = (d: FormData): Errors => {
    const e: Errors = {};
    if (!d.shopName.trim()) e.shopName = "Shop name is required";
    if (!d.description.trim() || d.description.length < 20)
      e.description = "Min 20 characters";
    if (!d.category) e.category = "Select a category";
    if (!d.province) e.province = "Province is required";
    if (!d.city.trim()) e.city = "City is required";
    if (!d.barangay.trim()) e.barangay = "Barangay is required";
    return e;
  };

  const validateStep2 = (d: FormData): Errors => {
    const e: Errors = {};
    if (!d.birFile) e.birFile = "BIR document is required";
    if (!d.birTin.trim()) e.birTin = "TIN is required";
    // Basic TIN format check
    if (!/^\d{3}-\d{3}-\d{3}-\d{3}$/.test(d.birTin))
      e.birTin = "Format: 000-000-000-000";
    return e;
  };

  const set = (k: keyof FormData, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k])
      setErrors((p) => {
        const n = { ...p };
        delete n[k];
        return n;
      });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((p) => ({ ...p, birFile: file, birPreview: preview }));
    if (errors.birFile)
      setErrors((p) => {
        const n = { ...p };
        delete n.birFile;
        return n;
      });
  };

  const next = () => {
    const errs =
      step === 1 ? validateStep1(form) : step === 2 ? validateStep2(form) : {};
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setStep((s) => s + 1);
  };

  const back = () => setStep((s) => s - 1);

  const submit = async () => {
    setSubmitting(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in");

      let finalFileUrl = "";

      // 1. Upload File First
      if (form.birFile) {
        let fileToUpload = form.birFile;
        if (fileToUpload.type.startsWith("image/")) {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          try {
            fileToUpload = await imageCompression(form.birFile, options);
          } catch (e) {
            console.error(e);
          }
        }

        const uploadRes = await uploadBirDocument(user.id, fileToUpload);
        if (!uploadRes.success) throw new Error(uploadRes.error);
        finalFileUrl = uploadRes.data.url;
      }

      // 2. Prepare Payload (Match DB exactly)
      const payload = {
        user_id: user.id,
        shop_name: form.shopName,
        shop_description: form.description,
        // category: form.category, // Added this
        province: form.province,
        city: form.city,
        barangay: form.barangay,
        full_address: form.fullAddress,
        bir_tin: form.birTin,
        bir_document_url: finalFileUrl,
        latitude: 0,
        longitude: 0,
      };

      // 3. API Call
      const response = await fetch("/api/seller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "ALREADY_APPROVED") {
          router.push("/seller/dashboard");
          return;
        }
        throw new Error(result.message || result.error || "Failed to submit");
      }

      // 4. Success Redirect
      const params = new URLSearchParams({
        shopName: form.shopName,
        location: `${form.barangay}, ${form.city}, ${form.province}`,
        tin: form.birTin,
        date: new Date().toISOString(),
      });

      toast.success("Application submitted!");
      router.push(`/seller/pending?${params.toString()}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pm-green-600 flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-pm-green-700 text-lg">PubMarket</span>
        </Link>
        <Link
          href="/seller/pending"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Already applied? Check status
        </Link>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              Become a Seller
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Set up your shop and start selling on PubMarket
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-8 gap-0">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                      step > s.id
                        ? "bg-pm-green-600 text-white"
                        : step === s.id
                          ? "bg-pm-green-600 text-white ring-4 ring-pm-green-100"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {step > s.id ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <s.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium hidden sm:block",
                      step === s.id
                        ? "text-pm-green-700"
                        : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-16 sm:w-24 mx-1 mb-5 transition-all duration-500",
                      step > s.id ? "bg-pm-green-500" : "bg-border",
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Card */}
          <Card className="shadow-sm border-border">
            <CardContent className="p-6">
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-foreground mb-4">
                    Business Information
                  </h2>
                  <div>
                    <Label htmlFor="shopName" className="text-sm font-medium">
                      Shop Name <span className="text-pm-red-500">*</span>
                    </Label>
                    <Input
                      id="shopName"
                      className="mt-1.5"
                      placeholder="e.g. Maria's Fresh Market"
                      value={form.shopName}
                      onChange={(e) => set("shopName", e.target.value)}
                    />
                    {errors.shopName && (
                      <p className="text-xs text-pm-red-500 mt-1">
                        {errors.shopName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="desc" className="text-sm font-medium">
                      Shop Description{" "}
                      <span className="text-pm-red-500">*</span>
                    </Label>
                    <Textarea
                      id="desc"
                      className="mt-1.5 min-h-[90px] resize-none"
                      placeholder="Tell customers what you sell..."
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-1">
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
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      Category <span className="text-pm-red-500">*</span>
                    </Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => set("category", v)}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select a category" />
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
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium">
                        Province <span className="text-pm-red-500">*</span>
                      </Label>
                      <Select
                        value={form.province}
                        onValueChange={(v) => set("province", v)}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Province" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVINCES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.province && (
                        <p className="text-xs text-pm-red-500 mt-1">
                          {errors.province}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium">
                        City/Municipality{" "}
                        <span className="text-pm-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        className="mt-1.5"
                        placeholder="City"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                      />
                      {errors.city && (
                        <p className="text-xs text-pm-red-500 mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="brgy" className="text-sm font-medium">
                      Barangay <span className="text-pm-red-500">*</span>
                    </Label>
                    <Input
                      id="brgy"
                      className="mt-1.5"
                      placeholder="Barangay"
                      value={form.barangay}
                      onChange={(e) => set("barangay", e.target.value)}
                    />
                    {errors.barangay && (
                      <p className="text-xs text-pm-red-500 mt-1">
                        {errors.barangay}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="addr" className="text-sm font-medium">
                      Full Address
                    </Label>
                    <Input
                      id="addr"
                      className="mt-1.5"
                      placeholder="Street, Purok, etc."
                      value={form.fullAddress}
                      onChange={(e) => set("fullAddress", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-foreground mb-1">
                    BIR Document
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload your BIR Certificate of Registration (COR) for
                    verification.
                  </p>

                  <div>
                    <Label className="text-sm font-medium">
                      BIR TIN Number <span className="text-pm-red-500">*</span>
                    </Label>
                    <Input
                      className="mt-1.5"
                      placeholder="000-000-000-000"
                      value={form.birTin}
                      onChange={(e) => set("birTin", e.target.value)}
                    />
                    {errors.birTin && (
                      <p className="text-xs text-pm-red-500 mt-1">
                        {errors.birTin}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Upload BIR Document{" "}
                      <span className="text-pm-red-500">*</span>
                    </Label>
                    {!form.birPreview ? (
                      <label
                        className={cn(
                          "mt-1.5 flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl py-10 cursor-pointer transition-all",
                          errors.birFile
                            ? "border-pm-red-300 bg-pm-red-50"
                            : "border-pm-stone-300 hover:border-pm-green-400 hover:bg-pm-green-50",
                        )}
                      >
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-foreground">
                          Click to upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, PNG, JPG up to 10MB
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleFile}
                        />
                      </label>
                    ) : (
                      <div className="mt-1.5 relative rounded-xl border border-border overflow-hidden bg-muted">
                        {form.birFile?.type === "application/pdf" ? (
                          <div className="flex items-center gap-3 p-4">
                            <div className="w-10 h-10 rounded-lg bg-pm-red-100 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-pm-red-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">
                                {form.birFile.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(form.birFile.size / 1024).toFixed(0)} KB
                              </p>
                            </div>
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={form.birPreview}
                            alt="BIR preview"
                            className="w-full max-h-48 object-contain p-2"
                          />
                        )}
                        <button
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              birFile: null,
                              birPreview: null,
                            }))
                          }
                          className="absolute top-2 right-2 p-1 bg-background/80 backdrop-blur rounded-full border border-border hover:bg-muted"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {errors.birFile && (
                      <p className="text-xs text-pm-red-500 mt-1">
                        {errors.birFile}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-foreground mb-4">
                    Review & Submit
                  </h2>
                  <div className="rounded-xl bg-muted/50 border border-border divide-y divide-border overflow-hidden">
                    {[
                      { label: "Shop Name", value: form.shopName },
                      { label: "Category", value: form.category },
                      {
                        label: "Location",
                        value: `${form.barangay}, ${form.city}, ${form.province}`,
                      },
                      { label: "TIN", value: form.birTin },
                      {
                        label: "BIR Document",
                        value: form.birFile?.name || "—",
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex justify-between gap-4 px-4 py-3"
                      >
                        <span className="text-sm text-muted-foreground flex-shrink-0">
                          {label}
                        </span>
                        <span className="text-sm font-medium text-foreground text-right truncate">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-pm-green-50 border border-pm-green-200 rounded-xl p-4 text-sm text-pm-green-800">
                    <p className="font-medium mb-1">What happens next?</p>
                    <p className="text-pm-green-700 text-xs leading-relaxed">
                      Our team will review your application within 1–3 business
                      days. You'll be notified once approved or if additional
                      info is needed.
                    </p>
                  </div>
                </div>
              )}

              {/* Footer buttons */}
              <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-border">
                {step > 1 ? (
                  <Button variant="outline" onClick={back} className="gap-2">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                ) : (
                  <Link href="/dashboard">
                    <Button variant="ghost" className="text-muted-foreground">
                      Cancel
                    </Button>
                  </Link>
                )}
                {step < 3 ? (
                  <Button
                    onClick={next}
                    className="bg-pm-green-600 hover:bg-pm-green-700 text-white gap-2 ml-auto"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={submit}
                    disabled={submitting}
                    className="bg-pm-green-600 hover:bg-pm-green-700 text-white gap-2 ml-auto min-w-[120px]"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Progress indicator */}
          <p className="text-center text-xs text-muted-foreground mt-4">
            Step {step} of {STEPS.length}
          </p>
        </div>
      </div>
    </div>
  );
}
