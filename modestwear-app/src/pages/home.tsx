import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Shield, Truck } from 'lucide-react';
import { Products, categories } from '@/data/data';
import ProductCard from '@/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Home() {
  const featuredProducts = Products.filter((p) => p.featured);
  const newArrivals = Products.filter((p) => p.isNew);
  const saleProducts = Products.filter((p) => p.discount);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://s3.amazonaws.com/shecodesio-production/uploads/files/000/178/073/original/alyssa-strohmann-TS--uNw-JqE-unsplash.jpg?1770544446w=1200)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-primary-foreground">
            <h1 className="text-4xl md:text-6xl mb-6">
              Elegance Meets Modesty
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
              Discover our curated collection of modest fashion designed for the modern woman.
              Quality, comfort, and style in every piece.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/category?filter='all'">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/category?filter='sale'">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  View Sale
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Truck className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="mb-1">Free Shipping</h4>
                <p className="text-sm text-muted-foreground">On orders over R500</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="mb-1">Secure Payment</h4>
                <p className="text-sm text-muted-foreground">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="mb-1">Easy Returns</h4>
                <p className="text-sm text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Find the perfect style for every occasion</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(1, 5).map((category) => (
             <Link key={category.id} href={`/category/${category.id}`}>
             <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="aspect-square overflow-hidden bg-muted">
            <img
             src={category.image}
             alt={category.name}
             className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
             />
            </div>
            <CardContent className="p-4 text-center">
            <h3 className="mb-1">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
            {category.count} items
            </p>
            </CardContent>
            </Card>
            </Link>
           ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Featured Collection</h2>
            <p className="text-muted-foreground">Handpicked favorites from our latest collection</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/category">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">New Arrivals</h2>
              <p className="text-muted-foreground">
                Be the first to discover our latest modest fashion pieces
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Special Features Banner */}
      <section className="py-16 bg-gradient-to-r from-accent/20 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="#" onClick={(e) => { e.preventDefault(); toast.info('Feature coming soon!')}}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="p-8 flex flex-col justify-center h-full">
                  <Sparkles className="h-12 w-12 text-accent mb-4" />
                  <h3 className="text-2xl mb-4">Outfit Builder</h3>
                  <p className="text-muted-foreground mb-4">
                    Mix and match pieces to create your perfect modest outfit. Drag, drop, and
                    style!
                  </p>
                  <Button variant="outline" className="w-fit group-hover:bg-accent group-hover:text-accent-foreground">
                    Try It Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
            <Link href="/virtual-try-on">
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="p-8 flex flex-col justify-center h-full">
                  <Sparkles className="h-12 w-12 text-accent mb-4" />
                  <h3 className="text-2xl mb-4">Virtual Try-On</h3>
                  <p className="text-muted-foreground mb-4">
                    See how our clothes look on you before you buy. Upload your photo and try on
                    items virtually!
                  </p>
                  <Button variant="outline" className="w-fit group-hover:bg-accent group-hover:text-accent-foreground">
                    Start Trying On
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Sale Section */}
      {saleProducts.length > 0 && (
        <section className="py-16 bg-destructive/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 text-destructive">Limited Time Sale</h2>
              <p className="text-muted-foreground">Don't miss out on these amazing deals</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/category?filter='sale'">
                <Button size="lg" className="bg-destructive hover:bg-destructive/90">
                  Shop All Sale Items
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Stay Updated</h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive deals, style tips, and first access to new
            collections
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button
              type="submit"
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}