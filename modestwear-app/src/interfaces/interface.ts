

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images: string[];
  category: string;
  description: string;
  fabric: string;
  care: string;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  featured?: boolean;
  isNew?: boolean;
}

// Category
export type Category = {
  id: string;
  name: string;
  count: number;
  image: string;
}; 

// Order
export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  color: string;
  size: string;
}

// User Address
export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

// Checkout Form
export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  saveAddress: boolean;
  paymentMethod: 'card' | 'paypal' | 'cod';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

// Review 
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

// Virtual Try-On 
export interface TryOnSession {
  id: string;
  productId: string;
  imageSrc: string;
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
    position: { x: number; y: number };
    scale: number;
    rotation: number;
  };
}
