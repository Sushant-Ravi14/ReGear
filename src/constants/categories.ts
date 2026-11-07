export interface Category {
  id: string;
  slug: string;
  label: string;
  icon: string;
  description: string;
  dummyJsonCategories?: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    slug: 'all',
    label: 'All Products',
    icon: 'LayoutGrid',
    description: 'Browse our entire verified refurbished collection',
  },
  {
    id: 'smartphones',
    slug: 'smartphones',
    label: 'Smartphones',
    icon: 'Smartphone',
    description: 'iPhones, Galaxy, Pixels & premium certified smartphones',
    dummyJsonCategories: ['smartphones'],
  },
  {
    id: 'laptops',
    slug: 'laptops',
    label: 'Laptops',
    icon: 'Laptop',
    description: 'MacBooks, ThinkPads, ultrabooks & gaming laptops',
    dummyJsonCategories: ['laptops'],
  },
  {
    id: 'tablets',
    slug: 'tablets',
    label: 'Tablets',
    icon: 'Tablet',
    description: 'iPads, Galaxy Tabs & digital graphics tablets',
    dummyJsonCategories: ['tablets'],
  },
  {
    id: 'gaming',
    slug: 'gaming',
    label: 'Gaming',
    icon: 'Gamepad2',
    description: 'Consoles, controllers, handhelds & gaming gear',
    dummyJsonCategories: [],
  },
  {
    id: 'pc-components',
    slug: 'pc-components',
    label: 'PC Components',
    icon: 'Cpu',
    description: 'GPUs, CPUs, RAM, motherboards & power supplies',
    dummyJsonCategories: [],
  },
  {
    id: 'monitors',
    slug: 'monitors',
    label: 'Monitors',
    icon: 'Monitor',
    description: '4K displays, gaming high refresh rate monitors & ultrawides',
    dummyJsonCategories: [],
  },
  {
    id: 'audio',
    slug: 'audio',
    label: 'Audio',
    icon: 'Headphones',
    description: 'Noise-canceling headphones, earbuds & studio monitors',
    dummyJsonCategories: [],
  },
  {
    id: 'accessories',
    slug: 'accessories',
    label: 'Accessories',
    icon: 'Keyboard',
    description: 'Keyboards, mice, docks, chargers & cables',
    dummyJsonCategories: ['mobile-accessories'],
  },
];

export const CONDITIONS = [
  'Brand New',
  'Like New',
  'Excellent',
  'Good',
  'Fair',
] as const;

export type ProductCondition = (typeof CONDITIONS)[number];

export const PRODUCT_STATUSES = [
  'Available',
  'Reserved',
  'Sold',
  'Draft',
  'Removed',
] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Highest Discount' },
] as const;

export const CONDITION_DETAILS: Record<
  string,
  { badgeClass: string; description: string }
> = {
  'Brand New': {
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Unopened box or never used with full original packaging.',
  },
  'Like New': {
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
    description: 'Pristine cosmetic condition with no visible scratches or marks.',
  },
  'Excellent': {
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Micro-scratches barely visible from 20cm away; fully tested.',
  },
  'Good': {
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Light signs of normal use, minor scuffs on body; 100% functional.',
  },
  'Fair': {
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Noticeable wear or minor scratches; rigorously bench-tested.',
  },
};
