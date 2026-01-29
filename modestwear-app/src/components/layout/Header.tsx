import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Search, ShoppingCart, Heart, User, Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Badge } from '@/components/common/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/common/sheet';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const route = useRouter();
  
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      route(`/category/all?search=${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navigation = [
    { name: 'New Arrivals', href: '/category/all?filter=new' },
    { name: 'Dresses', href: '/category/dresses' },
    { name: 'Abayas', href: '/category/abayas' },
    { name: 'Sets', href: '/category/sets' },
    { name: 'Sale', href: '/category/sale' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center">
        <p className="text-sm">Free shipping on orders over $100 | Use code: WELCOME20 for 20% off</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <nav className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                <hr className="my-4" />
                <Link href="/outfit-builder" className="text-lg hover:text-accent transition-colors flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Outfit Builder
                </Link>
                <Link href="/virtual-try-on" className="text-lg hover:text-accent transition-colors flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Virtual Try-On
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-2xl md:text-3xl">ModestWear</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-accent transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search */}
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 lg:w-64"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Account */}
            <Link href={currentUser ? '/account' : '/login'}>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit" size="sm">
                Search
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Secondary Navigation - Desktop Only */}
      <div className="hidden lg:block border-t border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center space-x-8 text-sm">
            <Link href="/outfit-builder" className="hover:text-accent transition-colors flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Outfit Builder
            </Link>
            <Link href="/virtual-try-on" className="hover:text-accent transition-colors flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Virtual Try-On
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}