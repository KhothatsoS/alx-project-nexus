import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/interfaces/interface';

export interface OutfitItem {
  product: Product;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  layer: number;
}

interface OutfitBuilderState {
  currentOutfit: OutfitItem[];
  savedOutfits: { id: string; name: string; items: OutfitItem[]; createdAt: string }[];
  selectedItemId: string | null;
}

const initialState: OutfitBuilderState = {
  currentOutfit: [],
  savedOutfits: [],
  selectedItemId: null,
};

const outfitBuilderSlice = createSlice({
  name: 'outfitBuilder',
  initialState,
  reducers: {
    addItemToOutfit: (state, action: PayloadAction<{ product: Product }>) => {
      const newItem: OutfitItem = {
        product: action.payload.product,
        position: { x: 50, y: 50 },
        scale: 1,
        rotation: 0,
        layer: state.currentOutfit.length,
      };
      state.currentOutfit.push(newItem);
      state.selectedItemId = action.payload.product.id;
    },
    removeItemFromOutfit: (state, action: PayloadAction<string>) => {
      state.currentOutfit = state.currentOutfit.filter(
        (item) => item.product.id !== action.payload
      );
      if (state.selectedItemId === action.payload) {
        state.selectedItemId = null;
      }
    },
    updateItemPosition: (
      state,
      action: PayloadAction<{ productId: string; position: { x: number; y: number } }>
    ) => {
      const item = state.currentOutfit.find((i) => i.product.id === action.payload.productId);
      if (item) {
        item.position = action.payload.position;
      }
    },
    updateItemScale: (state, action: PayloadAction<{ productId: string; scale: number }>) => {
      const item = state.currentOutfit.find((i) => i.product.id === action.payload.productId);
      if (item) {
        item.scale = action.payload.scale;
      }
    },
    updateItemRotation: (state, action: PayloadAction<{ productId: string; rotation: number }>) => {
      const item = state.currentOutfit.find((i) => i.product.id === action.payload.productId);
      if (item) {
        item.rotation = action.payload.rotation;
      }
    },
    updateItemLayer: (state, action: PayloadAction<{ productId: string; layer: number }>) => {
      const item = state.currentOutfit.find((i) => i.product.id === action.payload.productId);
      if (item) {
        item.layer = action.payload.layer;
      }
    },
    selectItem: (state, action: PayloadAction<string | null>) => {
      state.selectedItemId = action.payload;
    },
    clearOutfit: (state) => {
      state.currentOutfit = [];
      state.selectedItemId = null;
    },
    saveOutfit: (state, action: PayloadAction<string>) => {
      if (state.currentOutfit.length > 0) {
        state.savedOutfits.push({
          id: Date.now().toString(),
          name: action.payload,
          items: [...state.currentOutfit],
          createdAt: new Date().toISOString(),
        });
      }
    },
    loadOutfit: (state, action: PayloadAction<string>) => {
      const outfit = state.savedOutfits.find((o) => o.id === action.payload);
      if (outfit) {
        state.currentOutfit = [...outfit.items];
      }
    },
    deleteOutfit: (state, action: PayloadAction<string>) => {
      state.savedOutfits = state.savedOutfits.filter((o) => o.id !== action.payload);
    },
  },
});

export const {
  addItemToOutfit,
  removeItemFromOutfit,
  updateItemPosition,
  updateItemScale,
  updateItemRotation,
  updateItemLayer,
  selectItem,
  clearOutfit,
  saveOutfit,
  loadOutfit,
  deleteOutfit,
} = outfitBuilderSlice.actions;
export default outfitBuilderSlice.reducer;