"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import type { RootState, AppDispatch } from "@/store/store";
import { logout } from "@/store/slices/userSlice";
import { Orders } from "@/data/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Package, Heart, MapPin, LogOut, Sparkles, } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// [API: GET /user] - Get user profile
// [API: GET /orders] - Get user orders
// [API: GET /addresses] - Get saved addresses
// [API: PATCH /user] - Update profile

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <User className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="mb-4">Please Log In</h2>
        <p className="text-muted-foreground mb-6">
          Access your account to view orders and more
        </p>
        <Link href="/login">
          <Button size="lg">Log In</Button>
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-700";
      case "shipped":
        return "bg-blue-500/10 text-blue-700";
      case "processing":
        return "bg-yellow-500/10 text-yellow-700";
      case "cancelled":
        return "bg-red-500/10 text-red-700";
      default:
        return "bg-gray-500/10 text-gray-700";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">My Account</h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser.name}!
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="mb-1">{currentUser.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                <Link href="/outfit-builder">
                  <Button variant="ghost" className="w-full justify-start">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Outfit Builder
                  </Button>
                </Link>

                <Link href="/wishlist">
                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist ({wishlistItems.length})
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="orders">
            <TabsList className="mb-6">
              <TabsTrigger value="orders">
                <Package className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="addresses">
                <MapPin className="h-4 w-4 mr-2" />
                Addresses
              </TabsTrigger>
            </TabsList>

            {/* Orders */}
            <TabsContent value="orders">
              <div className="space-y-4">
                {Orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between mb-4">
                        <div>
                          <h3>Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()} •{" "}
                            {order.items.length} items
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <p className="text-lg font-semibold text-accent">
                            R{order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 flex-wrap">
                        {order.items.map((item, index) => (
                          <Image
                            key={index}
                            src={item.productImage}
                            alt={item.productName}
                            width={64}
                            height={64}
                            className="rounded object-cover"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
