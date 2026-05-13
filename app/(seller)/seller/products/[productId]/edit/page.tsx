"use client";

// /seller/products/[productId]/edit
// Reuses ProductForm from seller-products-new.tsx

import React from "react";
import { ProductForm } from "@/components/custom/form/seller-products/seller-products-new";
import { useEffect, useState } from "react";

// In real app, fetch product data based on productId param
const MOCK_PRODUCT = {
  name: "Kangkong (Swamp Cabbage)",
  category: "Vegetables",
  price: "25",
  stock: "4",
  description:
    "Freshly harvested swamp cabbage from local farms in Iligan City. Tender, vibrant green leaves perfect for sautéing with garlic or adding to soups. Rich in iron and vitamins. Picked daily for maximum freshness.",
  location: "Hinaplanon, Iligan City",
  status: "active" as const,
  images: [],
};

interface PageProps {
  params: { productId: string };
}

export default function SellerProductEditPage({ params }: PageProps) {
  const [prodId, setProdId] = useState<string>("");
  useEffect(() => {
    const productId = async () => {
      const { id } = await params;
      setProdId(id);
    };
    productId();
  }, [params]);
  return (
    <ProductForm
      mode="edit"
      productId={prodId}
      initialData={{
        ...MOCK_PRODUCT,
        status: MOCK_PRODUCT.status === "active" ? "published" : "draft",
      }}
    />
  );
}
