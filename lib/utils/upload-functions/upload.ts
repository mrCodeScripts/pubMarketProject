// =============================================================================
// PUBMARKET — STORAGE UPLOAD FUNCTIONS
// lib/supabase/uploads.ts
// =============================================================================
// Compression happens CLIENT-SIDE before calling these.
// These functions just take a File and upload it — no compression here.
// See bottom of file for compression usage examples.
// =============================================================================

import { createClient } from "@/lib/supabase/client"; // browser client — uploads run client-side
import type { APIResponse } from "@/lib/types";

// =============================================================================
// HELPER
// =============================================================================

async function uploadToStorage(
  bucket: string,
  path: string,
  file: File,
): Promise<APIResponse<{ url: string }>> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) return { success: false, error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { success: true, data: { url: data.publicUrl } };
}

// =============================================================================
// AVATAR
// Bucket: pubmarket-avatars
// Path:   {userId}/avatar.{ext}
// =============================================================================

export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<APIResponse<{ url: string }>> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;
  return uploadToStorage("pubmarket-avatars", path, file);
}

// =============================================================================
// PRODUCT THUMBNAIL
// Bucket: pubmarket-products
// Path:   {userId}/{productId}/thumbnail.{ext}
// =============================================================================

export async function uploadProductThumbnail(
  userId: string,
  productId: string,
  file: File,
): Promise<APIResponse<{ url: string }>> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${productId}/thumbnail.${ext}`;
  return uploadToStorage("pubmarket-products", path, file);
}

// =============================================================================
// PRODUCT GALLERY IMAGE
// Bucket: pubmarket-products
// Path:   {userId}/{productId}/{timestamp}.{ext}
// =============================================================================

export async function uploadProductImage(
  userId: string,
  productId: string,
  file: File,
): Promise<APIResponse<{ url: string }>> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${productId}/${Date.now()}.${ext}`;
  return uploadToStorage("pubmarket-products", path, file);
}

// Upload multiple gallery images at once — returns all URLs or first error
export async function uploadProductImages(
  userId: string,
  productId: string,
  files: File[],
): Promise<APIResponse<{ urls: string[] }>> {
  const results = await Promise.all(
    files.map((file) => uploadProductImage(userId, productId, file)),
  );

  const failed = results.find((r) => !r.success);
  if (failed) return { success: false, error: failed.error };

  const urls = results.map((r) => r.data!.url);
  return { success: true, data: { urls } };
}

// =============================================================================
// SHOP LOGO
// Bucket: pubmarket-shops
// Path:   {userId}/logo.{ext}
// =============================================================================

export async function uploadShopLogo(
  userId: string,
  file: File,
): Promise<APIResponse<{ url: string }>> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/logo.${ext}`;
  return uploadToStorage("pubmarket-shops", path, file);
}

// =============================================================================
// SHOP BANNER
// Bucket: pubmarket-shops
// Path:   {userId}/banner.{ext}
// =============================================================================

export async function uploadShopBanner(
  userId: string,
  file: File,
): Promise<APIResponse<{ url: string }>> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/banner.${ext}`;
  return uploadToStorage("pubmarket-shops", path, file);
}

// =============================================================================
// BIR DOCUMENT
// Bucket: pubmarket-documents
// Path:   {userId}/bir.{ext}
// =============================================================================

export async function uploadBirDocument(
  userId: string,
  file: File,
): Promise<APIResponse<{ url: string }>> {
  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `${userId}/bir.${ext}`;
  return uploadToStorage("pubmarket-documents", path, file);
}

// =============================================================================
// DELETE FILE (for cleanup when replacing images)
// =============================================================================

export async function deleteStorageFile(
  bucket: string,
  path: string,
): Promise<APIResponse> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Extract path from a public URL (for deletion)
// e.g. "https://xxx.supabase.co/storage/v1/object/public/pubmarket-avatars/user-123/avatar.jpg"
// → "user-123/avatar.jpg"
export function extractStoragePath(publicUrl: string): string {
  const parts = publicUrl.split("/public/");
  if (parts.length < 2) return "";
  // Remove bucket name prefix
  const withBucket = parts[1];
  const slashIndex = withBucket.indexOf("/");
  return withBucket.substring(slashIndex + 1);
}

// =============================================================================
// COMPRESSION USAGE EXAMPLES
// Install: npm install browser-image-compression
// Import:  import imageCompression from "browser-image-compression";
// =============================================================================

/*

// --- PRESET OPTIONS ---

const AVATAR_OPTIONS = {
  maxSizeMB: 0.3,        // 300kb max
  maxWidthOrHeight: 400, // square avatar
  useWebWorker: true,
};

const PRODUCT_IMAGE_OPTIONS = {
  maxSizeMB: 0.8,         // 800kb max
  maxWidthOrHeight: 1200, // product detail quality
  useWebWorker: true,
};

const THUMBNAIL_OPTIONS = {
  maxSizeMB: 0.3,        // 300kb max
  maxWidthOrHeight: 600,
  useWebWorker: true,
};

const BANNER_OPTIONS = {
  maxSizeMB: 1,           // 1mb max
  maxWidthOrHeight: 1600,
  useWebWorker: true,
};

const DOCUMENT_OPTIONS = {
  // PDFs — skip compression, just validate size
  // only compress if it's an image document
  maxSizeMB: 2,
  useWebWorker: true,
};


// --- EXAMPLE 1: Avatar upload with compression ---

"use client";
import imageCompression from "browser-image-compression";
import { uploadAvatar } from "@/lib/supabase/uploads";
import { updateProfile } from "@/lib/utils/queries";

async function handleAvatarChange(
  e: React.ChangeEvent<HTMLInputElement>,
  userId: string
) {
  const file = e.target.files?.[0];
  if (!file) return;

  // 1. Compress
  const compressed = await imageCompression(file, AVATAR_OPTIONS);

  // 2. Upload
  const upload = await uploadAvatar(userId, compressed);
  if (!upload.success) return console.error(upload.error);

  // 3. Save URL to profile
  await updateProfile(userId, { avatar_url: upload.data.url });
}

// Usage in JSX:
// <input type="file" accept="image/*" onChange={(e) => handleAvatarChange(e, userId)} />


// --- EXAMPLE 2: Product thumbnail ---

async function handleThumbnailChange(
  e: React.ChangeEvent<HTMLInputElement>,
  userId: string,
  productId: string
) {
  const file = e.target.files?.[0];
  if (!file) return;

  const compressed = await imageCompression(file, THUMBNAIL_OPTIONS);
  const upload = await uploadProductThumbnail(userId, productId, compressed);
  if (!upload.success) return console.error(upload.error);

  // update product thumbnail_url via updateProduct()
  console.log("Thumbnail URL:", upload.data.url);
}


// --- EXAMPLE 3: Multiple product gallery images ---

async function handleGalleryChange(
  e: React.ChangeEvent<HTMLInputElement>,
  userId: string,
  productId: string
) {
  const files = Array.from(e.target.files ?? []);
  if (!files.length) return;

  // Compress all in parallel
  const compressed = await Promise.all(
    files.map((f) => imageCompression(f, PRODUCT_IMAGE_OPTIONS))
  );

  const upload = await uploadProductImages(userId, productId, compressed);
  if (!upload.success) return console.error(upload.error);

  // upload.data.urls is string[] — save each via addProductImage()
  console.log("Gallery URLs:", upload.data.urls);
}

// Usage in JSX (multiple files):
// <input type="file" accept="image/*" multiple onChange={(e) => handleGalleryChange(e, userId, productId)} />


// --- EXAMPLE 4: BIR document (PDF or image) ---

async function handleBirUpload(
  e: React.ChangeEvent<HTMLInputElement>,
  userId: string
) {
  const file = e.target.files?.[0];
  if (!file) return;

  // Only compress if it's an image, skip for PDFs
  const toUpload =
    file.type.startsWith("image/")
      ? await imageCompression(file, DOCUMENT_OPTIONS)
      : file;

  const upload = await uploadBirDocument(userId, toUpload);
  if (!upload.success) return console.error(upload.error);

  // save upload.data.url to seller_profiles.bir_document_url
  console.log("BIR URL:", upload.data.url);
}

// Usage in JSX:
// <input type="file" accept="image/*,application/pdf" onChange={(e) => handleBirUpload(e, userId)} />


// --- EXAMPLE 5: Replacing an existing image (delete old, upload new) ---

async function handleReplaceAvatar(
  e: React.ChangeEvent<HTMLInputElement>,
  userId: string,
  existingAvatarUrl: string | null
) {
  const file = e.target.files?.[0];
  if (!file) return;

  // Delete old file first (optional — upsert will overwrite anyway for avatar)
  if (existingAvatarUrl) {
    const oldPath = extractStoragePath(existingAvatarUrl);
    await deleteStorageFile("pubmarket-avatars", oldPath);
  }

  const compressed = await imageCompression(file, AVATAR_OPTIONS);
  const upload = await uploadAvatar(userId, compressed);
  if (!upload.success) return console.error(upload.error);

  await updateProfile(userId, { avatar_url: upload.data.url });
}

*/
