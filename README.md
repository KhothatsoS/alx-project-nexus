# ModestWear – Fashion E-commerce Platform

## Problem Statement

Many women struggle to find elegant, modest fashion online with easy filtering, sizing guidance, and affordable checkout experiences. Existing platforms are either overwhelming or lack personalization.

## Product Goals

### Primary goals:

- Sell modest & elegant fashion online
- Smooth mobile-first shopping experience
- Fast checkout
- Personalised product discovery
- Admin dashboard for inventory & orders
- Scalable backend

## Target Audience

- Females aged 16–50
- Prefer modest, elegant outfits
- Mobile-first shoppers
- South African & African market initially
- Budget-conscious to mid-range

## CORE FEATURES

- Customer Facing
- Browse products
- Categories & collections
- Filters (price, size, colour, length, fabric)
- Search
- Wishlist
- Cart
- Checkout
- Payments
- Order tracking
- Account profile
- Reviews
- Similar items
- Promotions / discount codes

## Special Features

- Outfit Builder - Create custom outfit combinations
- Virtual Try-On - Visualize products before purchase
- Free shipping threshold

## Admin Panel

- Product management
- Order management
- Inventory tracking
- User management
- Promotions
- Reports & analytics
- Refund handling

# PAGE-BY-PAGE WEBSITE STRUCTURE

## 🏠 Homepage

### Sections:

- Hero banner (new arrivals / sale)
- Category tiles (Dresses, Abayas, Sets, Tops)
- Trending items
- Recommended
- Promo banner
- Newsletter signup
- Footer

### APIs Needed:

- GET /collections/featured
- GET /products/trending

## Product Listing Page (Category)

## Features:

- Grid view
- Filters sidebar
- Sort by price/popularity
- Pagination / infinite scroll

## Filters:

- Size
- Colour
- Price
- Length
- Fabric
- Availability

### APIs:

- GET /products?category=&size=&colour=&price=

## Product Detail Page

### Sections:

- Image gallery
- Zoom
- Size selector
- Colour swatches
- Price + discount
- Stock status
- Add to cart
- Wishlist
- Description
- Fabric & care
- Shipping info
- Reviews
- Similar products

### APIs:

- GET /products/:id
- GET /products/:id/similar
- POST /cart

## 🛒 Cart Page

### Features:

- Item list
- Quantity change
- Remove item
- Subtotal
- Promo code

### APIs:

- GET /cart
- PATCH /cart
- POST /promo/apply

## 💳 Checkout Flow

### Steps:

- Shipping info
- Delivery method
- Payment
- Order confirmation

### Payment options:

- Credit/Debit card
- PayPal integration
- Capitec Pay
- Cash on Delivery (COD)
- Card number input
- Expiry date input
- CVV input
- Secure payment indicators

### APIs:

- POST /checkout
- POST /payments/initiate
- POST /payments/verify

## 👤 User Account

- Orders history
- Addresses
- Wishlist
- Profile
- Password reset

### APIs:

- GET /orders/me
- GET /wishlist
- PATCH /profile

## 🔐 Auth Pages

- Login
- Register
- Forgot password
- OTP/email verification

### APIs:

- POST /auth/register
- POST /auth/login
- POST /auth/reset-password

# FRONTEND vs BACKEND RESPONSIBILITIES

## 🎨 Frontend Developer (FE)

### Responsibilities:

- UI implementation (React / Next.js)
- Responsive design
- State management
- API integration
- Form validation
- Checkout UX
- Accessibility
- SEO
- Performance optimization
- Error handling

### FE builds:

- All pages
- Admin UI
- Cart interactions
- Filters
- Payment forms
- Design system
- Animations

## Backend Developer (BE)

### Responsibilities:

- Database design
- Auth system
- Product catalog service
- Order service
- Payment integration
- Inventory management
- Admin APIs
- Security
- Logging
- Notifications
- Hosting & CI/CD

### BE builds:

- REST/GraphQL APIs
- Admin backend
- Recommendation logic
- Stock handling
- Refund handling
- Webhooks

# DESIGN SYSTEM

### Color Palette (Elegant + Modern):

- Primary: #111827 (charcoal black)
- Secondary: #F5EFE7 (cream)
- Accent: #C9A24D (gold)
- Sale: #E63946 (red)
- Background: #FFFFFF

### Typography:

- Heading: Playfair Display / Poppins
- Body: Inter / Lato

### UI Style:

- Clean white space
- Large product images
- Rounded cards
- Sticky header
- Floating cart icon
- Hover effects
- Skeleton loaders
- Quick-add buttons

## 📁 Project Structure

```
modestwear/
├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout
|   |    |   |    |── Header.tsx
│   │   │   ├     |── Footer.tsx
│   │   │   ├── products/
            |        |── ProductCard.tsx
│   │   │   └── ui/            # Shadcn UI components
│   │   ├── pages/             # Application pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── CategoryPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── WishlistPage.tsx
│   │   │   ├── AccountPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── OutfitBuilderPage.tsx
│   │   │   ├── VirtualTryOnPage.tsx
│   │   │   └── admin/
│   │   │       └── AdminDashboard.tsx
│   │   └── App.tsx            # Main app with routing
│   ├── store/                 # Redux state management
│   │   ├── store.ts
|   |   |── hooks.ts           # Redux store configuration
│   │   └── slices/
│   │       ├── cartSlice.ts
│   │       ├── wishlistSlice.ts
│   │       ├── userSlice.ts
│   │       └── outfitBuilderSlice.ts
│   ├── data/
│   │   └── data.ts            # Mock data for development
│   ├── interfaces/
│   │   └── interface.ts       # TypeScript type definitions
│   └── styles/                # Styling
│       ├── globals.css
├── package.json
├── tailwind.config.ts
|── eslint.config.mjs
|── next-env.d.ts
|── next.config.ts
|── package-lock.json
|── package.json
|──postcss.config.mjs
|── tsconfig.json
|── .gitignore
└── README.md
```
