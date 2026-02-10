"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Products, Reviews } from '@/data/data';
import { addToCart } from '@/store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, ShoppingCart, Truck, RefreshCcw, Shield, Star, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '@/products/ProductCard';

export default function ProductDetail() {
  const router = useRouter();
  const { productId } = router.query;

  const dispatch = useDispatch();

  if (!productId || typeof productId !== "string") {
    return null;
  }

  const product = Products.find((p) => p.id === productId);

  const reviews = Reviews[productId] || [];

  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.items
  );

  const isInWishlist = wishlistItems.some(
    (item) => item.id === productId
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);


  if (!product) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl mb-4">Product not found</h2>
      <Button onClick={() => router.push('/')}>Return to Home</Button>
    </div>
  );
}

const handleAddToCart = () => {
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    dispatch(
      addToCart({
        product,
        quantity,
        color: selectedColor,
        size: selectedSize,
      })
    );
    toast.success('Added to cart');
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist');
    }
  };

  const relatedProducts = Products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/home" className="hover:text-accent">
              Home
            </Link>
            <span>/</span>
            <Link href={`/category/${product.category}`} className="hover:text-accent capitalize">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-muted">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg ${
                      selectedImage === index ? 'ring-2 ring-accent' : ''
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.discount && (
                <Badge className="bg-destructive text-destructive-foreground">
                  Save {product.discount}%
                </Badge>
              )}
              {product.isNew && <Badge className="bg-accent text-accent-foreground">New</Badge>}
              {!product.inStock && <Badge variant="secondary">Out of Stock</Badge>}
            </div>

            <h1 className="text-3xl md:text-4xl mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl text-accent">R{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  R{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Color Selection */}
            {product.inStock && (
              <>
                <div className="mb-6">
                  <Label className="mb-3 block">
                    Color: {selectedColor && <span className="text-accent">{selectedColor}</span>}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <Label className="mb-3 block">
                    Size: {selectedSize && <span className="text-accent">{selectedSize}</span>}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <Label className="mb-3 block">Quantity</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mb-8">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleWishlistToggle}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isInWishlist ? 'fill-destructive text-destructive' : ''
                      }`}
                    />
                  </Button>
                </div>
              </>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-accent" />
                <span>Free shipping on orders over R500</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCcw className="h-5 w-5 text-accent" />
                <span>30-day easy returns</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-accent" />
                <span>1-year warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-6">
            <p className="text-muted-foreground">{product.description}</p>
          </TabsContent>
          <TabsContent value="details" className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2">Fabric</h4>
                <p className="text-muted-foreground">{product.fabric}</p>
              </div>
              <div>
                <h4 className="mb-2">Care Instructions</h4>
                <p className="text-muted-foreground">{product.care}</p>
              </div>
              <div>
                <h4 className="mb-2">Available Colors</h4>
                <p className="text-muted-foreground">{product.colors.join(', ')}</p>
              </div>
              <div>
                <h4 className="mb-2">Available Sizes</h4>
                <p className="text-muted-foreground">{product.sizes.join(', ')}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="pt-6">
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="mb-1">{review.userName}</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-accent text-accent'
                                      : 'text-muted-foreground/30'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">{review.comment}</p>
                      <Button variant="ghost" size="sm">
                        Helpful ({review.helpful})
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No reviews yet</p>
            )}
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`font-medium ${className}`}>{children}</label>;
}