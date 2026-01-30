"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { removeFromCart, updateQuantity, applyPromoCode, } from "@/store/slices/cartSlice";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { promoCodes } from "@/data/data";

// [API: GET /cart]
// [API: PATCH /cart]
// [API: DELETE /cart/:itemId]
// [API: POST /promo-codes/validate]

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const appliedPromoCode = useSelector(
    (state: RootState) => state.cart.promoCode
  );
  const promoDiscount = useSelector(
    (state: RootState) => state.cart.discount
  );

  const [promoCode, setPromoCode] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const discount = (subtotal * promoDiscount) / 100;
  const total = subtotal + shipping + tax - discount;

  const handleRemoveFromCart = (
    productId: string,
    color: string,
    size: string
  ) => {
    dispatch(removeFromCart({ productId, color, size }));
    toast.success("Item removed from cart");
  };

  const handleUpdateQuantity = (
    productId: string,
    color: string,
    size: string,
    quantity: number
  ) => {
    dispatch(updateQuantity({ productId, color, size, quantity }));
  };

  const handleApplyPromo = () => {
    const promo = (promoCodes as any)[promoCode.toUpperCase()];

    if (promo) {
      const discountValue =
        promo.type === "percentage" ? promo.discount : 0;

      dispatch(
        applyPromoCode({
          code: promoCode.toUpperCase(),
          discount: discountValue,
        })
      );

      toast.success(`Promo code applied! ${discountValue}% off`);
      setPromoCode("");
    } else {
      toast.error("Invalid promo code");
    }
  };

  {/* EMPTY CART VIEW */}
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag
            size={64}
            className="mx-auto mb-4 text-muted-foreground"
          />
          <h2 className="mb-2">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Start shopping to add items to your cart
          </p>

          <Link href="/category/all">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  {/* Main View */}
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card
              key={`${item.product.id}-${item.color}-${item.size}`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={96}
                    height={128}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <Link
                      href={`/product/${item.product.id}`}
                      className="hover:text-accent"
                    >
                      <h3 className="mb-1">{item.product.name}</h3>
                    </Link>

                    <p className="text-sm text-muted-foreground mb-2">
                      {item.color} / {item.size}
                    </p>

                    <p className="text-accent mb-4">
                      R{item.product.price.toFixed(2)}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.color,
                              item.size,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          <Minus size={14} />
                        </Button>

                        <span className="w-12 text-center text-sm">
                          {item.quantity}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.color,
                              item.size,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus size={14} />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveFromCart(
                            item.product.id,
                            item.color,
                            item.size
                          )
                        }
                      >
                        <Trash2 size={16} className="mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      R
                      {(
                        item.product.price *
                        item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="mb-6">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal
                  </span>
                  <span>R{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Shipping
                  </span>
                  <span>
                    {shipping === 0
                      ? "FREE"
                      : `R${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tax (8%)
                  </span>
                  <span>R{tax.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-accent">
                    <span>
                      Discount ({appliedPromoCode})
                    </span>
                    <span>-R{discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span>Total</span>
                  <span className="font-semibold text-accent">
                    R{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {!appliedPromoCode && (
                <div className="mb-6">
                  <label className="text-sm mb-2 block">
                    Have a promo code?
                  </label>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleApplyPromo()
                      }
                    />

                    <Button
                      variant="outline"
                      onClick={handleApplyPromo}
                    >
                      Apply
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    Try: MODEST10, WELCOME20
                  </p>
                </div>
              )}

              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link
                href="/category/all"
                className="block text-center text-sm text-accent mt-4 hover:underline"
              >
                Continue Shopping
              </Link>

              {subtotal < 100 && (
                <div className="mt-4 p-3 bg-accent/10 rounded-lg text-sm text-center">
                  Add{" "}
                  <span className="font-semibold">
                    R{(100 - subtotal).toFixed(2)}
                  </span>{" "}
                  more to get free shipping!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
