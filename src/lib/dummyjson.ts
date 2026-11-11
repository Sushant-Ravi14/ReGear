import { DEMO_USERS } from './demoUser';
import connectToDatabase from './mongodb';
import Product from '@/models/Product';
import User from '@/models/User';

const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

const CATEGORY_MAP: Record<string, string> = {
  smartphones: 'Smartphones',
  laptops: 'Laptops',
  tablets: 'Tablets',
  'mobile-accessories': 'Accessories',
};

const TECH_HUBS = [
  'Bengaluru, Karnataka',
  'Hyderabad, Telangana',
  'Mumbai, Maharashtra',
  'Delhi NCR',
  'Pune, Maharashtra',
  'Chennai, Tamil Nadu',
];

/**
 * Fetch products from DummyJSON for the supported electronic categories
 */
export async function fetchDummyJsonProducts(): Promise<any[]> {
  const categoriesToFetch = ['smartphones', 'laptops', 'tablets', 'mobile-accessories'];
  const allProducts: any[] = [];

  for (const cat of categoriesToFetch) {
    try {
      const res = await fetch(`${DUMMYJSON_BASE_URL}/products/category/${cat}?limit=30`, {
        headers: { 'User-Agent': 'ReGear-Marketplace/1.0' },
        cache: 'no-store',
      });

      if (!res.ok) {
        console.warn(`[DummyJSON] Failed fetching category ${cat}: Status ${res.status}`);
        continue;
      }

      const data = await res.json();
      if (Array.isArray(data.products)) {
        allProducts.push(...data.products);
      }
    } catch (err: any) {
      console.error(`[DummyJSON] Network error fetching ${cat}:`, err.message);
    }
  }

  return allProducts;
}

/**
 * Deterministically assign a refurbished condition based on rating or id
 */
function getConditionFromProduct(p: any): string {
  if (p.rating >= 4.5) return 'Like New';
  if (p.rating >= 3.8) return 'Excellent';
  if (p.rating >= 3.0) return 'Good';
  return 'Fair';
}

/**
 * Transform a DummyJSON product into the ReGear Product schema
 */
export function transformDummyJsonProduct(p: any, index: number = 0) {
  const mappedCategory = CATEGORY_MAP[p.category] || 'Accessories';
  const usdToInr = 83; // Conversion to INR
  const price = Math.round(Number(p.price || 99) * usdToInr);
  const discount = Number(p.discountPercentage) || 15;
  const originalPrice = Math.round(price * (1 + discount / 100));
  const location = TECH_HUBS[index % TECH_HUBS.length];

  const images = Array.isArray(p.images) && p.images.length > 0
    ? p.images
    : (p.thumbnail ? [p.thumbnail] : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80']);

  return {
    title: p.title || 'Refurbished Tech Device',
    brand: p.brand || 'Generic',
    model: p.title || 'Standard Edition',
    description: p.description || 'Verified pre-owned tech device inspected and restored to optimal performance.',
    category: mappedCategory,
    price,
    originalPrice,
    condition: getConditionFromProduct(p),
    images,
    location,
    sellerId: DEMO_USERS.seller._id,
    sellerName: DEMO_USERS.seller.name,
    sellerEmail: DEMO_USERS.seller.email,
    sellerPhone: DEMO_USERS.seller.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: String(p.id),
    specs: {
      warranty: p.warrantyInformation || '6 Months ReGear Certified Warranty',
      shipping: p.shippingInformation || 'Express Dispatch in 24 Hours',
      returnPolicy: p.returnPolicy || '7 Days Replacement Guarantee',
      stock: p.stock || 5,
      rating: p.rating || 4.2,
      tags: Array.isArray(p.tags) ? p.tags : [],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'No cracks or dead pixels',
      bodyCondition: 'Inspected with minor or no surface blemishes',
      batteryHealth: '85%+ capacity verified',
      accessoriesIncluded: 'Compatible charger and charging cable included',
      originalBox: false,
      repairHistory: 'Clean diagnostic check',
    },
  };
}

/**
 * Curated initial items ensuring full coverage across ALL categories
 */
export const CURATED_CATEGORY_STARTERS = [
  // Smartphones
  {
    title: 'Apple iPhone 13 Pro (128GB, Sierra Blue)',
    brand: 'Apple',
    model: 'iPhone 13 Pro A2638',
    description: 'Certified refurbished iPhone 13 Pro with 120Hz ProMotion display, pristine Ceramic Shield front, and triple camera system with Cinematic mode.',
    category: 'Smartphones',
    price: 54999,
    originalPrice: 119900,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Bengaluru, Karnataka',
    sellerId: DEMO_USERS.seller._id,
    sellerName: DEMO_USERS.seller.name,
    sellerEmail: DEMO_USERS.seller.email,
    sellerPhone: DEMO_USERS.seller.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: 'curated-phone-01',
    specs: {
      warranty: '6 Months ReGear Certified Warranty',
      shipping: 'Express Insured Courier',
      returnPolicy: '7 Days Return',
      stock: 4,
      rating: 4.9,
      tags: ['smartphone', 'apple', 'iphone'],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'Flawless OLED, zero scratches',
      bodyCondition: 'Surgical-grade stainless steel in mint shape',
      batteryHealth: '92% Battery Health',
      accessoriesIncluded: 'Original Lightning to USB-C cable',
      originalBox: true,
      repairHistory: 'Original OEM parts verified',
    },
  },
  // Laptops
  {
    title: 'Apple MacBook Air M1 (256GB SSD, 8GB RAM, Space Grey)',
    brand: 'Apple',
    model: 'MacBook Air A2337',
    description: 'Incredibly thin and fast Apple MacBook Air with revolutionary M1 silicon chip, Retina True Tone display, and all-day battery life.',
    category: 'Laptops',
    price: 49999,
    originalPrice: 99900,
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Pune, Maharashtra',
    sellerId: DEMO_USERS.seller._id,
    sellerName: DEMO_USERS.seller.name,
    sellerEmail: DEMO_USERS.seller.email,
    sellerPhone: DEMO_USERS.seller.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: 'curated-laptop-01',
    specs: {
      warranty: '6 Months ReGear Warranty',
      shipping: 'Shockproof Packaging',
      returnPolicy: '7 Days Return',
      stock: 3,
      rating: 4.8,
      tags: ['laptop', 'macbook', 'apple', 'm1'],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'Zero dead pixels, anti-reflective coating intact',
      bodyCondition: 'Clean aluminium unibody',
      batteryHealth: '89% Battery Health (114 cycle count)',
      accessoriesIncluded: 'Original 30W USB-C Power Adapter & Cable',
      originalBox: true,
      repairHistory: 'Never serviced; clean board diagnostics',
    },
  },
  // Gaming
  {
    title: 'Sony PlayStation 5 Digital Edition (825GB)',
    brand: 'Sony',
    model: 'PS5 Digital CFI-1115B',
    description: 'Pristine condition Sony PlayStation 5 Digital Edition with DualSense wireless controller and HDMI 2.1 cable.',
    category: 'Gaming',
    price: 36999,
    originalPrice: 44990,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Bengaluru, Karnataka',
    sellerId: DEMO_USERS.seller._id,
    sellerName: DEMO_USERS.seller.name,
    sellerEmail: DEMO_USERS.seller.email,
    sellerPhone: DEMO_USERS.seller.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: 'curated-gaming-01',
    specs: {
      warranty: '6 Months ReGear Certified Warranty',
      shipping: 'Express Delivery',
      returnPolicy: '7 Days Return',
      stock: 3,
      rating: 4.8,
      tags: ['gaming', 'ps5', 'console'],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'N/A (Console)',
      bodyCondition: 'Pristine, no scuffs',
      batteryHealth: 'Controller 100% capacity',
      accessoriesIncluded: 'DualSense controller, HDMI cable, Power cord',
      originalBox: true,
      repairHistory: 'Never opened or repaired',
    },
  },
  // PC Components
  {
    title: 'NVIDIA GeForce RTX 3080 Founders Edition 10GB',
    brand: 'NVIDIA',
    model: 'RTX 3080 FE 10GB GDDR6X',
    description: 'Bench-tested and thermal paste refreshed. Runs cool under stress with zero coil whine.',
    category: 'PC Components',
    price: 42999,
    originalPrice: 71000,
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Hyderabad, Telangana',
    sellerId: DEMO_USERS.seller._id,
    sellerName: DEMO_USERS.seller.name,
    sellerEmail: DEMO_USERS.seller.email,
    sellerPhone: DEMO_USERS.seller.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: 'curated-pccomp-01',
    specs: {
      warranty: '6 Months Warranty',
      shipping: 'Shock-proof Packaging',
      returnPolicy: '7 Days Return',
      stock: 2,
      rating: 4.7,
      tags: ['gpu', 'nvidia', 'rtx3080'],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'N/A',
      bodyCondition: 'Clean heatsink, no bent fins',
      batteryHealth: 'N/A',
      accessoriesIncluded: '12-pin power adapter',
      originalBox: true,
      repairHistory: 'Thermal pads repasted with Thermal Grizzly',
    },
  },
  // Monitors
  {
    title: 'LG UltraGear 27GP850-B 27" QHD Nano IPS 165Hz Monitor',
    brand: 'LG',
    model: '27GP850-B',
    description: 'Fast 1ms GtG 165Hz (180Hz OC) QHD Nano IPS Gaming Monitor with HDR400 and NVIDIA G-Sync compatibility.',
    category: 'Monitors',
    price: 21999,
    originalPrice: 38000,
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Mumbai, Maharashtra',
    sellerId: DEMO_USERS.seller._id,
    sellerName: DEMO_USERS.seller.name,
    sellerEmail: DEMO_USERS.seller.email,
    sellerPhone: DEMO_USERS.seller.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: 'curated-mon-01',
    specs: {
      warranty: '6 Months ReGear Warranty',
      shipping: 'Fragile Box Transport',
      returnPolicy: '7 Days Return',
      stock: 4,
      rating: 4.6,
      tags: ['monitor', 'gaming', 'lg'],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'Zero dead pixels, zero backlight bleed',
      bodyCondition: 'Stand and bezel in mint condition',
      batteryHealth: 'N/A',
      accessoriesIncluded: 'Original Stand, DP Cable, Power Brick',
      originalBox: true,
      repairHistory: 'None',
    },
  },
  // Audio
  {
    title: 'Sony WH-1000XM4 Wireless Noise Cancelling Headphones',
    brand: 'Sony',
    model: 'WH-1000XM4 Black',
    description: 'Industry-leading noise canceling with Dual Noise Sensor technology. Up to 30-hour battery life with quick charging.',
    category: 'Audio',
    price: 16499,
    originalPrice: 29990,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Delhi NCR',
    sellerId: DEMO_USERS.seller._id,
    sellerName: DEMO_USERS.seller.name,
    sellerEmail: DEMO_USERS.seller.email,
    sellerPhone: DEMO_USERS.seller.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: 'curated-audio-01',
    specs: {
      warranty: '6 Months ReGear Warranty',
      shipping: 'Express Delivery',
      returnPolicy: '7 Days Replacement',
      stock: 5,
      rating: 4.9,
      tags: ['audio', 'sony', 'headphones', 'anc'],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'N/A',
      bodyCondition: 'Pristine earpads, no scuffs',
      batteryHealth: 'Holds full 30h charge',
      accessoriesIncluded: 'Original hard carrying case, 3.5mm cable, USB-C cable',
      originalBox: true,
      repairHistory: 'None',
    },
  },
  // Tablets
  {
    title: 'Apple iPad Air 5th Gen (64GB Wi-Fi, Space Grey)',
    brand: 'Apple',
    model: 'iPad Air M1 MM9C3HN/A',
    description: 'Powered by the Apple M1 chip with 10.9-inch Liquid Retina display, Touch ID, and Apple Pencil 2 support.',
    category: 'Tablets',
    price: 38999,
    originalPrice: 59900,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Bengaluru, Karnataka',
    sellerId: DEMO_USERS.seller._id,
    sellerName: DEMO_USERS.seller.name,
    sellerEmail: DEMO_USERS.seller.email,
    sellerPhone: DEMO_USERS.seller.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: 'curated-tablet-01',
    specs: {
      warranty: '6 Months ReGear Certified Warranty',
      shipping: 'Express Dispatch',
      returnPolicy: '7 Days Return',
      stock: 3,
      rating: 4.8,
      tags: ['tablet', 'ipad', 'apple'],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'Mint condition, tempered glass protected',
      bodyCondition: 'No dings or scratches',
      batteryHealth: '94% battery health',
      accessoriesIncluded: 'USB-C Cable & 20W Power Adapter',
      originalBox: true,
      repairHistory: 'None',
    },
  },
  // Accessories
  {
    title: 'Apple Magic Keyboard with Touch ID and Numeric Keypad',
    brand: 'Apple',
    model: 'Magic Keyboard A2520',
    description: 'Wireless Bluetooth keyboard with integrated Touch ID sensor and numeric keypad for quick authentication and comfortable typing.',
    category: 'Accessories',
    price: 8999,
    originalPrice: 19500,
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Chennai, Tamil Nadu',
    sellerId: DEMO_USERS.seller._id,
    sellerName: DEMO_USERS.seller.name,
    sellerEmail: DEMO_USERS.seller.email,
    sellerPhone: DEMO_USERS.seller.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: 'curated-access-01',
    specs: {
      warranty: '3 Months ReGear Warranty',
      shipping: 'Standard Delivery',
      returnPolicy: '7 Days Replacement',
      stock: 6,
      rating: 4.7,
      tags: ['keyboard', 'apple', 'accessory'],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'N/A',
      bodyCondition: 'Clean keycaps, scissor mechanism smooth',
      batteryHealth: 'Holds charge for over 1 month',
      accessoriesIncluded: 'Woven USB-C to Lightning cable',
      originalBox: false,
      repairHistory: 'None',
    },
  },
];

/**
 * Ensures MongoDB is populated with products. If empty, automatically seeds it.
 */
export async function ensureCatalogueSeeded(): Promise<number> {
  await connectToDatabase();

  const count = await Product.countDocuments();
  if (count > 0) return count;

  console.log('[Auto-Seed] Products collection is empty. Auto-seeding initial catalogue...');

  try {
    // 1. Ensure Demo Users
    await User.updateOne(
      { email: DEMO_USERS.seller.email },
      {
        $set: {
          name: DEMO_USERS.seller.name,
          email: DEMO_USERS.seller.email,
          phone: DEMO_USERS.seller.phone,
          location: DEMO_USERS.seller.location,
          role: 'seller',
          profileImage: DEMO_USERS.seller.avatar,
        },
      },
      { upsert: true }
    );

    // 2. Fetch from DummyJSON
    const dummyProducts = await fetchDummyJsonProducts();
    const transformed = dummyProducts.map((p, idx) => transformDummyJsonProduct(p, idx));
    const allProducts = [...transformed, ...CURATED_CATEGORY_STARTERS];

    // 3. Upsert products
    for (const item of allProducts) {
      await Product.updateOne(
        { source: 'dummyjson', externalProductId: item.externalProductId },
        { $set: item, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }

    const newCount = await Product.countDocuments();
    console.log(`[Auto-Seed] Successfully seeded ${newCount} products.`);
    return newCount;
  } catch (err: any) {
    console.error('[Auto-Seed] Error during seeding:', err.message);

    // Fallback: insert curated starter products
    for (const item of CURATED_CATEGORY_STARTERS) {
      await Product.updateOne(
        { source: 'dummyjson', externalProductId: item.externalProductId },
        { $set: item, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    return await Product.countDocuments();
  }
}
