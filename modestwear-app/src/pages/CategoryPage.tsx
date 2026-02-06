"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Products, categories, filters } from "@/data/data";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;

  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search");
  const filterParam = searchParams.get("filter");

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [sortBy, setSortBy] = useState("featured");

  const category = categoryId
  ? categories.find((c) => c.id === categoryId)
  : null;

  // FILTER + SORTING LOGIC
  const filteredProducts = useMemo(() => {
    let products = [...Products];

    // Category
    if (categoryId && categoryId !== "all") {
      if (categoryId === "sale") {
        products = products.filter((p) => p.discount);
      } else {
        products = products.filter(
          (p) => p.category === categoryId
        );
      }
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      products = products.filter((p) =>
        p.name.toLowerCase().includes(q)
      );
    }

    // New
    if (filterParam === "new") {
      products = products.filter((p) => p.isNew);
    }

    // Size
    if (selectedSizes.length > 0) {
      products = products.filter((p) =>
        p.sizes.some((size) =>
          selectedSizes.includes(size)
        )
      );
    }

    // Color
    if (selectedColors.length > 0) {
      products = products.filter((p) =>
        p.colors.some((color) =>
          selectedColors.includes(color)
        )
      );
    }

    // Price
    products = products.filter(
      (p) =>
        p.price >= priceRange[0] &&
        p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;

      case "newest":
        products.sort(
          (a, b) =>
            Number(b.isNew) - Number(a.isNew)
        );
        break;

      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;

      default:
        products.sort(
          (a, b) =>
            Number(b.featured) -
            Number(a.featured)
        );
    }

    return products;
  }, [
    categoryId,
    searchQuery,
    filterParam,
    selectedSizes,
    selectedColors,
    priceRange,
    sortBy,
  ]);

  // HELPERS
  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 500]);
  };

  // FILTER UI
  const FilterSection = () => (
    <div className="space-y-8">
      {/* PRICE */}
      <div>
        <h3 className="mb-4">Price Range</h3>

        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={500}
          step={10}
          className="mb-4"
        />

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>R{priceRange[0]}</span>
          <span>R{priceRange[1]}</span>
        </div>
      </div>

      {/* SIZE */}
      <div>
        <h3 className="mb-4">Size</h3>

        <div className="flex flex-wrap gap-2">
          {filters.sizes.map((size) => (
            <Button
              key={size}
              size="sm"
              variant={
                selectedSizes.includes(size)
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                handleSizeToggle(size)
              }
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* COLOR */}
      <div>
        <h3 className="mb-4">Color</h3>

        <div className="space-y-2">
          {filters.colors.map((color) => (
            <div
              key={color}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={`color-${color}`}
                checked={selectedColors.includes(
                  color
                )}
                onCheckedChange={() =>
                  handleColorToggle(color)
                }
              />

              <Label htmlFor={`color-${color}`}>
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={clearFilters}
        variant="outline"
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );

  // PAGE
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl mb-2">
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : category?.name || "All Products"}
        </h1>

        <p className="text-muted-foreground">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1
            ? "product"
            : "products"}{" "}
          found
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP FILTERS */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <FilterSection />
          </div>
        </aside>

        {/* PRODUCTS */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            {/* MOBILE FILTER */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[300px] overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <div className="mt-8">
                  <FilterSection />
                </div>
              </SheetContent>
            </Sheet>

            {/* SORT */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="hidden sm:block text-sm text-muted-foreground">
                Sort by:
              </span>

              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="featured">
                    Featured
                  </SelectItem>
                  <SelectItem value="newest">
                    Newest
                  </SelectItem>
                  <SelectItem value="price-low">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="rating">
                    Highest Rated
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">
                No products found
              </p>

              <Button
                onClick={clearFilters}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
