"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "@/products/ProductCard";
import { Products } from "@/data/data";
// [API: GET /wishlist] - Fetch wishlist

export default function Wishlist() {
  const Product = useSelector((state: RootState) => state.wishlist.items);

  if (Product.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Heart size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Save your favorite items to your wishlist to view them here later.
          </p>
          <Link href="/category">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground">{Product.length} item{Product.length > 1 ? 's' : ''}</p>
        
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
