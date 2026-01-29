import { useState } from 'react';
import { Link } from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/interfaces/interface';
import { addToWishlist, removeFromWishlist } from '@/store/slices/wishlistSlice';
import { RootState } from '@/store/store';
import { Button } from '@/components/common/button';
import { Badge } from '@/components/common/badge';
import { Card, CardContent } from '@/components/common/card';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(product));
      toast.success('Added to wishlist');
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card
        className="group overflow-hidden hover:shadow-lg transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.discount && (
              <Badge className="bg-destructive text-destructive-foreground">
                -{product.discount}%
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-accent text-accent-foreground">New</Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-card/80 hover:bg-card"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-5 w-5 ${
                isInWishlist ? 'fill-destructive text-destructive' : ''
              }`}
            />
          </Button>

          {/* Quick View Overlay */}
          {isHovered && product.inStock && (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
              <Button size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                Quick View
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-2 capitalize">
            {product.category}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(product.rating)
                      ? 'text-accent'
                      : 'text-muted-foreground/30'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg text-accent"><ZAR>{product.price.toFixed(2)}</ZAR></span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                <ZAR>{product.originalPrice.toFixed(2)}</ZAR>
              </span>
            )}
          </div>

          {/* Colors Available */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {product.colors.slice(0, 5).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{
                    backgroundColor: color.toLowerCase().includes('black')
                      ? '#000'
                      : color.toLowerCase().includes('white')
                      ? '#fff'
                      : color.toLowerCase().includes('navy')
                      ? '#001f3f'
                      : color.toLowerCase().includes('beige')
                      ? '#F5F5DC'
                      : '#ccc',
                  }}
                  title={color}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-muted-foreground ml-1">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}