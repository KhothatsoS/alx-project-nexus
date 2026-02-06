import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/interfaces/interface';

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
  size: string;
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discount: number;
}

const initialState: CartState = {
  items: [],
  promoCode: null,
  discount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === action.payload.product.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<{ productId: string; color: string; size: string }>) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.product.id === action.payload.productId &&
            item.color === action.payload.color &&
            item.size === action.payload.size
          )
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; color: string; size: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) =>
          item.product.id === action.payload.productId &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.promoCode = null;
      state.discount = 0;
    },
    applyPromoCode: (state, action: PayloadAction<{ code: string; discount: number }>) => {
      state.promoCode = action.payload.code;
      state.discount = action.payload.discount;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyPromoCode } = cartSlice.actions;
export default cartSlice.reducer;