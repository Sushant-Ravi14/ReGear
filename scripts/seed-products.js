const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Try loading local environment variables if available
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/regear';

const DEMO_SELLER = {
  _id: new mongoose.Types.ObjectId('674000000000000000000001'),
  name: 'Sushant Ravi',
  email: 'sushant.ravi.cg@gmail.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, Karnataka',
  role: 'seller',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
};

const DEMO_BUYER = {
  _id: new mongoose.Types.ObjectId('674000000000000000000002'),
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '+91 91234 56789',
  location: 'Mumbai, Maharashtra',
  role: 'buyer',
  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
};

const CATEGORY_MAP = {
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

const CURATED_CATEGORY_STARTERS = [
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
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
    ],
    location: 'Bengaluru, Karnataka',
    sellerId: DEMO_SELLER._id,
    sellerName: DEMO_SELLER.name,
    sellerEmail: DEMO_SELLER.email,
    sellerPhone: DEMO_SELLER.phone,
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
  {
    title: 'Nintendo Switch OLED Model - White',
    brand: 'Nintendo',
    model: 'OLED White HEG-001',
    description: 'Vibrant 7-inch OLED screen with wide adjustable stand, enhanced audio, and 64 GB internal storage.',
    category: 'Gaming',
    price: 24999,
    originalPrice: 34999,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80'
    ],
    location: 'Mumbai, Maharashtra',
    sellerId: DEMO_SELLER._id,
    sellerName: DEMO_SELLER.name,
    sellerEmail: DEMO_SELLER.email,
    sellerPhone: DEMO_SELLER.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: 'curated-gaming-02',
    specs: {
      warranty: '6 Months Warranty',
      shipping: 'Standard Delivery',
      returnPolicy: '7 Days Return',
      stock: 2,
      rating: 4.9,
      tags: ['gaming', 'switch', 'nintendo'],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'Screen protector applied, 0 scratches',
      bodyCondition: 'White joy-cons clean and responsive',
      batteryHealth: '95% health verified',
      accessoriesIncluded: 'Dock, Joy-Con grip, HDMI, AC adapter',
      originalBox: true,
      repairHistory: 'None',
    },
  },
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
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80'
    ],
    location: 'Hyderabad, Telangana',
    sellerId: DEMO_SELLER._id,
    sellerName: DEMO_SELLER.name,
    sellerEmail: DEMO_SELLER.email,
    sellerPhone: DEMO_SELLER.phone,
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
  {
    title: 'AMD Ryzen 7 5800X 8-Core 16-Thread Processor',
    brand: 'AMD',
    model: 'Ryzen 7 5800X AM4',
    description: 'High performance gaming & workstation processor. Pins perfectly straight, fully tested on Cinebench R23.',
    category: 'PC Components',
    price: 15499,
    originalPrice: 28000,
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80'
    ],
    location: 'Delhi NCR',
    sellerId: DEMO_SELLER._id,
    sellerName: DEMO_SELLER.name,
    sellerEmail: DEMO_SELLER.email,
    sellerPhone: DEMO_SELLER.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: 'curated-pccomp-02',
    specs: {
      warranty: '3 Months Warranty',
      shipping: 'Anti-static protective clamshell',
      returnPolicy: '7 Days Return',
      stock: 3,
      rating: 4.8,
      tags: ['cpu', 'amd', 'ryzen'],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'N/A',
      bodyCondition: 'Flawless IHS, all pins straight',
      batteryHealth: 'N/A',
      accessoriesIncluded: 'Protective clamshell',
      originalBox: false,
      repairHistory: 'None',
    },
  },
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
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    ],
    location: 'Mumbai, Maharashtra',
    sellerId: DEMO_SELLER._id,
    sellerName: DEMO_SELLER.name,
    sellerEmail: DEMO_SELLER.email,
    sellerPhone: DEMO_SELLER.phone,
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
  {
    title: 'Dell UltraSharp U2723QE 27" 4K UHD IPS Black Monitor',
    brand: 'Dell',
    model: 'U2723QE 4K IPS Black',
    description: '2000:1 contrast ratio IPS Black monitor with USB-C Hub (90W PD), RJ45 Ethernet, and factory calibrated color.',
    category: 'Monitors',
    price: 34999,
    originalPrice: 58000,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=800&q=80'
    ],
    location: 'Bengaluru, Karnataka',
    sellerId: DEMO_SELLER._id,
    sellerName: DEMO_SELLER.name,
    sellerEmail: DEMO_SELLER.email,
    sellerPhone: DEMO_SELLER.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: 'curated-mon-02',
    specs: {
      warranty: '1 Year Dell Onsite Warranty Remaining',
      shipping: 'Insured Courier',
      returnPolicy: '7 Days Return',
      stock: 2,
      rating: 4.9,
      tags: ['monitor', 'dell', '4k', 'productivity'],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'Flawless IPS Black panel, factory calibrated',
      bodyCondition: 'No marks, platinum silver finish',
      batteryHealth: 'N/A',
      accessoriesIncluded: 'Type-C cable, DP cable, power cable, original box',
      originalBox: true,
      repairHistory: 'None',
    },
  },
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
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    location: 'Delhi NCR',
    sellerId: DEMO_SELLER._id,
    sellerName: DEMO_SELLER.name,
    sellerEmail: DEMO_SELLER.email,
    sellerPhone: DEMO_SELLER.phone,
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
  {
    title: 'Apple AirPods Pro (2nd Generation) with USB-C MagSafe Case',
    brand: 'Apple',
    model: 'MTJV3HN/A',
    description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, and Transparency mode with personalized spatial audio.',
    category: 'Audio',
    price: 14999,
    originalPrice: 24900,
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80'
    ],
    location: 'Pune, Maharashtra',
    sellerId: DEMO_SELLER._id,
    sellerName: DEMO_SELLER.name,
    sellerEmail: DEMO_SELLER.email,
    sellerPhone: DEMO_SELLER.phone,
    status: 'Available',
    source: 'dummyjson',
    externalProductId: 'curated-audio-02',
    specs: {
      warranty: '6 Months Warranty',
      shipping: 'Express Delivery',
      returnPolicy: '7 Days Return',
      stock: 6,
      rating: 4.8,
      tags: ['audio', 'apple', 'airpods', 'tws'],
    },
    conditionChecklist: {
      fullyFunctional: true,
      screenCondition: 'N/A',
      bodyCondition: 'Sanitized with UV light, micro hairline scratches on case',
      batteryHealth: '95%+ battery retention',
      accessoriesIncluded: 'USB-C braided cable, XS/S/M/L ear tips, MagSafe case',
      originalBox: true,
      repairHistory: 'None',
    },
  },
];

async function seed() {
  console.log('🔄 Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB successfully.');

  const db = mongoose.connection.db;

  // 1. Ensure Demo Users
  console.log('👤 Seeding demo users...');
  await db.collection('users').updateOne(
    { _id: DEMO_SELLER._id },
    { $set: DEMO_SELLER },
    { upsert: true }
  );
  await db.collection('users').updateOne(
    { _id: DEMO_BUYER._id },
    { $set: DEMO_BUYER },
    { upsert: true }
  );
  console.log('✅ Demo users verified in database.');

  // 2. Fetch DummyJSON items
  console.log('📦 Fetching products from DummyJSON API...');
  let dummyProducts = [];
  const categoriesToFetch = ['smartphones', 'laptops', 'tablets', 'mobile-accessories'];

  for (const cat of categoriesToFetch) {
    try {
      const res = await fetch(`https://dummyjson.com/products/category/${cat}?limit=30`, {
        headers: { 'User-Agent': 'ReGear-Marketplace/1.0' },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products)) {
          dummyProducts.push(...data.products);
        }
      }
    } catch (err) {
      console.warn(`[Warning] Could not fetch ${cat} from DummyJSON:`, err.message);
    }
  }

  console.log(`📡 Fetched ${dummyProducts.length} items from DummyJSON.`);

  // 3. Transform DummyJSON products
  const transformedProducts = dummyProducts.map((p, idx) => {
    const mappedCategory = CATEGORY_MAP[p.category] || 'Accessories';
    const usdToInr = 83;
    const price = Math.round(Number(p.price || 99) * usdToInr);
    const discount = Number(p.discountPercentage) || 15;
    const originalPrice = Math.round(price * (1 + discount / 100));
    const location = TECH_HUBS[idx % TECH_HUBS.length];

    let condition = 'Good';
    if (p.rating >= 4.5) condition = 'Like New';
    else if (p.rating >= 3.8) condition = 'Excellent';
    else if (p.rating < 3.0) condition = 'Fair';

    const images = Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : (p.thumbnail ? [p.thumbnail] : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80']);

    return {
      title: p.title || 'Refurbished Tech Device',
      brand: p.brand || 'Generic',
      model: p.title || 'Standard Model',
      description: p.description || 'Verified pre-owned tech device tested and restored to peak condition.',
      category: mappedCategory,
      price,
      originalPrice,
      condition,
      images,
      location,
      sellerId: DEMO_SELLER._id,
      sellerName: DEMO_SELLER.name,
      sellerEmail: DEMO_SELLER.email,
      sellerPhone: DEMO_SELLER.phone,
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
        bodyCondition: 'Minor surface blemishes from normal handling',
        batteryHealth: '85%+ capacity verified',
        accessoriesIncluded: 'Compatible charger and charging cable included',
        originalBox: false,
        repairHistory: 'Clean diagnostic check',
      },
      updatedAt: new Date(),
    };
  });

  const allSeedItems = [...transformedProducts, ...CURATED_CATEGORY_STARTERS];
  console.log(`🚀 Upserting ${allSeedItems.length} products into MongoDB...`);

  let upsertedCount = 0;
  for (const item of allSeedItems) {
    const result = await db.collection('products').updateOne(
      {
        source: 'dummyjson',
        externalProductId: item.externalProductId,
      },
      {
        $set: item,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );
    if (result.upsertedCount || result.modifiedCount) {
      upsertedCount++;
    }
  }

  // 4. Create Indexes
  console.log('⚙️ Creating database indexes...');
  try {
    await db.collection('products').createIndex({
      title: 'text',
      brand: 'text',
      model: 'text',
      description: 'text',
    });
    await db.collection('products').createIndex({ status: 1, category: 1, price: 1 });
    await db.collection('products').createIndex({ source: 1, externalProductId: 1 });
    await db.collection('favorites').createIndex({ userId: 1, productId: 1 }, { unique: true });
    await db.collection('enquiries').createIndex({ sellerId: 1, createdAt: -1 });
    await db.collection('offers').createIndex({ sellerId: 1, createdAt: -1 });
    console.log('✅ Indexes successfully ensured.');
  } catch (idxErr) {
    console.warn('Index notice:', idxErr.message);
  }

  const totalProducts = await db.collection('products').countDocuments();
  console.log(`\n🎉 Seed finished successfully! Total products in database: ${totalProducts}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
