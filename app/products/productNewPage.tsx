"use client";
import { Shell } from "../components/Shell";
import { ProductForm } from "./ProductForm";

export default function ProductNewPage() {
  return (
    <Shell active="products" requiresAuth>
      <div className="space-y-4">
        <ProductForm />
      </div>
    </Shell>
  );
}
