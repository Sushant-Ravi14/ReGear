# ReGear — Refurbished Electronics Marketplace

> **"Good tech. Better prices."**

ReGear is a modern, production-grade web marketplace built with **Next.js (App Router)**, **Tailwind CSS**, and **MongoDB with Mongoose**. It provides a premium, transparent platform to discover, buy, sell, and negotiate pre-owned and certified refurbished electronic devices (Smartphones, Laptops, Tablets, Gaming Consoles, PC Components, Monitors, Audio Gear, and Accessories).

---

## 🌟 Key Features

### 🛒 Buyer Experience
- **Interactive Catalogue**: Explore verified refurbished tech across 9 specialized electronics categories.
- **Dynamic Multi-faceted Search & Filtering**: Filter concurrently by category, price range, condition grade, brand, and stock availability.
- **Smart Sorting**: Sort dynamically by newest first, price ascending/descending, and largest discount percentage.
- **Comprehensive Product Details**: High-resolution image galleries, detailed hardware specifications, seller details, and transparency checklists.
- **Persistent Wishlist / Favorites**: Heart and save devices to MongoDB with instantaneous toggle feedback.
- **Direct Offers**: Submit negotiable price offers directly to the seller with automated validation.
- **Buyer Enquiries**: Send structured questions to sellers about battery health, chargers, or pickup details.
- **Functional Support Desk**: Embedded floating help desk with contact ticketing and FAQs.

### 💼 Seller Experience
- **Zero Commission Listings**: List gadgets with title, brand, model, category, pricing, and location.
- **Verified Condition Checklist**: Detailed transparency declarations for screen status, chassis condition, battery health, and repair history.
- **Flexible Image Uploads**: Cloudinary integration for cloud storage with an automatic local storage fallback for offline development.
- **Comprehensive Seller Dashboard**: Live metrics tracking active listings, sold items, pending enquiries, pending offers, and total inventory valuation.
- **Inventory Management**: Edit listings, toggle stock status between *Available* and *Sold*, or delete items with confirmation modals.
- **Offer & Enquiry Moderation**: Accept or decline incoming price offers and reply to buyer questions.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language & UI** | JavaScript (ES6+), React 18, [Tailwind CSS](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) / Local MongoDB via [Mongoose 8](https://mongoosejs.com/) |
| **Data Validation** | [Zod](https://zod.dev/) (Client & Server-side schema enforcement) |
| **External API** | [DummyJSON Products API](https://dummyjson.com/) (Initial catalogue data provider) |
| **Image Hosting** | [Cloudinary](https://cloudinary.com/) (with local filesystem fallback) |
| **Deployment Target** | [Vercel](https://vercel.com/) |

---

## 📁 Project Architecture

```text
ReGear/
├── public/
│   ├── uploads/            # Development fallback for uploaded listing images
│   ├── images/             # Static brand assets
│   └── icons/
├── scripts/
│   └── seed-products.js    # Idempotent database seeder (DummyJSON -> MongoDB)
├── src/
│   ├── app/
│   │   ├── (marketplace)/
│   │   ├── products/
│   │   │   ├── page.js           # Shop page with search, filters, pagination
│   │   │   └── [id]/page.js      # Product details, gallery, offers, enquiries
│   │   ├── categories/
│   │   │   └── [category]/page.js# Dynamic category showcase
│   │   ├── favorites/page.js     # Saved products page
│   │   ├── sell/
│   │   │   ├── page.js           # New listing creation form
│   │   │   └── edit/[id]/page.js # Listing editor
│   │   ├── dashboard/
│   │   │   ├── page.js           # Overview stats & recent activity
│   │   │   ├── listings/page.js  # Inventory management
│   │   │   ├── enquiries/page.js # Received buyer enquiries
│   │   │   └── offers/page.js    # Price negotiations & status transitions
│   │   ├── admin/page.js         # Moderation & seed console
│   │   ├── about/page.js         # Platform mission, e-waste reduction, FAQ
│   │   ├── api/
│   │   │   ├── products/         # GET (search/filter/sort/paginate), POST
│   │   │   ├── products/[id]/    # GET, PUT, DELETE, PATCH (status)
│   │   │   ├── favorites/        # GET, POST, DELETE
│   │   │   ├── enquiries/        # GET, POST, PATCH
│   │   │   ├── offers/           # GET, POST, PATCH
│   │   │   ├── upload/           # POST (Cloudinary / local image storage)
│   │   │   ├── dashboard/stats/  # GET (aggregated live MongoDB statistics)
│   │   │   └── seed/             # POST (administrative remote catalogue sync)
│   │   ├── layout.js
│   │   ├── globals.css
│   │   └── not-found.js
│   ├── components/
│   │   ├── layout/         # Header, Footer, FloatingSupport
│   │   ├── marketplace/    # HeroBanner, CategoryNav, SearchBar, SellerPromoPanel
│   │   ├── products/       # ProductCard, ProductGrid, ProductFilters, ProductGallery, etc.
│   │   ├── dashboard/      # DashboardNav, StatsOverview, ActivityList
│   │   ├── forms/          # ProductForm, EnquiryModal, OfferModal, SupportModal
│   │   └── ui/             # ToastNotifications, LoadingSkeleton, EmptyState, Pagination, etc.
│   ├── constants/
│   │   └── categories.js   # Centralized category definitions and condition metadata
│   ├── lib/
│   │   ├── mongodb.js      # Cached connection handler for Next.js & Serverless
│   │   ├── dummyjson.js    # DummyJSON API consumer and schema transformer
│   │   ├── cloudinary.js   # Cloudinary uploader with automatic fallback
│   │   ├── demoUser.js     # Configurable demo buyer and seller personas
│   │   └── utils.js        # Currency formatter (INR), date formatting, class mergers
│   ├── models/             # Mongoose Models: User, Product, Favorite, Enquiry, Offer
│   └── validations/        # Zod validation schemas
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.js
└── README.md
```

---

## ⚡ Quickstart Guide

### 1. Prerequisites
- **Node.js**: `v18.17.0` or later (tested on Node.js `v22.20.0`).
- **MongoDB**: An active MongoDB Atlas cluster or a local MongoDB instance running on port `27017`.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Sushant-Ravi14/ReGear.git
cd ReGear
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your connection details in `.env.local`:
```env
# MongoDB Connection String (Atlas URI or local)
MONGODB_URI=mongodb://127.0.0.1:27017/regear

# Optional: Cloudinary Credentials (If left empty, system uses local storage in public/uploads/)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Administrative Seed Secret
ADMIN_SEED_SECRET=regear_secret_seed_key_2026
```

### 4. Seed the Catalogue from DummyJSON
Run the idempotent seeding script:
```bash
npm run seed
```
This script:
1. Connects to MongoDB.
2. Ensures demo users exist (`Sushant Ravi` - Seller, `Priya Sharma` - Buyer).
3. Fetches live electronics from DummyJSON (`smartphones`, `laptops`, `tablets`, `mobile-accessories`).
4. Maps currencies and conditions into ReGear's schema.
5. Injects curated tech items for Gaming, PC Components, Monitors, and Audio.
6. Upserts without duplicating or modifying user-created listings.

### 5. Launch the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints Reference

All routes return standard JSON responses: `{ success: true, data: ... }` or `{ success: false, error: ... }`.

| Endpoint | Method | Description |
|---|---|---|
| `/api/products` | `GET` | Query listings with search, category, min/max price, condition, brand, sort, and pagination |
| `/api/products` | `POST` | Create a new listing with server-side Zod validation |
| `/api/products/:id` | `GET` | Get single product details + similar recommendations |
| `/api/products/:id` | `PUT` | Update an existing product listing |
| `/api/products/:id` | `DELETE` | Permanently remove a product and associated favorites |
| `/api/products/:id/status` | `PATCH` | Update listing status (*Available*, *Reserved*, *Sold*, *Draft*) |
| `/api/favorites` | `GET` | Retrieve user's favorited products |
| `/api/favorites` | `POST` | Add a product to favorites (duplicate-safe) |
| `/api/favorites/:id` | `DELETE` | Remove a product from favorites |
| `/api/enquiries` | `GET` | Fetch seller's received enquiries or buyer's sent enquiries |
| `/api/enquiries` | `POST` | Submit an enquiry message to a seller |
| `/api/enquiries/:id` | `PATCH` | Reply to an enquiry and update status (*Pending*, *Responded*, *Closed*) |
| `/api/offers` | `GET` | Retrieve price offers |
| `/api/offers` | `POST` | Submit a counter-price offer on an available product |
| `/api/offers/:id` | `PATCH` | Accept or reject an offer (*Accepted*, *Rejected*, *Withdrawn*) |
| `/api/upload` | `POST` | Multipart file upload handler (Cloudinary / Local fallback) |
| `/api/dashboard/stats` | `GET` | Aggregated live metrics from MongoDB |
| `/api/seed` | `POST` | Protected administrative remote seed trigger |

---

## 🔒 Authentication & Demo User Architecture

Per project requirements, full third-party authentication (OAuth/NextAuth) was omitted to keep the focus on core marketplace mechanics, database design, and API reliability.

Instead, ReGear utilizes a **Demo User Context**:
- **Demo Seller**: `Sushant Ravi` (`674000000000000000000001`) — Owns sample inventory, receives enquiries, reviews incoming offers, and manages listings in the seller dashboard.
- **Demo Buyer**: `Priya Sharma` (`674000000000000000000002`) — Submits questions, places price bids, and favorites products.

All identifiers are valid 24-character hexadecimal MongoDB ObjectIds, ensuring zero casting issues and smooth migration to full authentication in future revisions.

---

## 🚀 Vercel Deployment Instructions

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete production-quality ReGear marketplace"
   git push origin main
   ```
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import the `ReGear` GitHub repository.
4. In the **Environment Variables** section, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/regear?retryWrites=true&w=majority`).
   - `NEXT_PUBLIC_APP_URL`: Your Vercel production URL (e.g., `https://regear-marketplace.vercel.app`).
   - `CLOUDINARY_CLOUD_NAME` (optional)
   - `CLOUDINARY_API_KEY` (optional)
   - `CLOUDINARY_API_SECRET` (optional)
   - `ADMIN_SEED_SECRET`: A secure key used to seed the database in production.
5. In **MongoDB Atlas**: Navigate to **Network Access** and ensure `0.0.0.0/0` (Allow access from anywhere) is enabled so Vercel serverless functions can connect.
6. Click **Deploy**.
7. Once deployed, run the initial seed via HTTP POST:
   ```bash
   curl -X POST "https://your-app.vercel.app/api/seed?secret=regear_secret_seed_key_2026"
   ```

---

## 🎓 Academic Evaluation Guide

When presenting this project to an evaluator, highlight these core engineering decisions:
1. **Separation of Concerns**: Clean isolation between API Route Handlers (`src/app/api/`), Database Models (`src/models/`), Business Logic (`src/lib/`), UI Components (`src/components/`), and Validation (`src/validations/`).
2. **Idempotent Data Seeding**: Running `npm run seed` uses MongoDB `$set` and `$setOnInsert` keyed on `(source, externalProductId)`. It never creates duplicate items and preserves user-created listings.
3. **Optimized Next.js Patterns**: Server Components handle initial data loading directly with zero client waterfall; Client Components handle interactive states (modals, filters, toasts, toggles).
4. **Database Indexing**: Compound indexes on `{ status: 1, category: 1, price: 1 }` and full-text search indexes on product titles and descriptions ensure sub-millisecond query execution.
5. **Resilient Image Handling**: Seamless fallback between Cloudinary and local disk storage ensures the application runs out-of-the-box in any development environment.

---

## 📜 License
Developed for educational evaluation under academic guidelines. Initial sample data sourced under attribution from [DummyJSON](https://dummyjson.com).
