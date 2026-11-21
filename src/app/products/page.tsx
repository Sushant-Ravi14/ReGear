'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters, { FilterState } from '@/components/products/ProductFilters';
import SortDropdown from '@/components/products/SortDropdown';
import Pagination from '@/components/ui/Pagination';
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { ProductItem } from '@/components/products/ProductCard';

interface PaginationState {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 12,
    totalCount: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Active filters derived from URL or local state
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    condition: searchParams.get('condition') || '',
    status: searchParams.get('status') || 'Available',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  // Sync state if URL changes externally
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      condition: searchParams.get('condition') || '',
      status: searchParams.get('status') || 'Available',
      sort: searchParams.get('sort') || 'newest',
      page: parseInt(searchParams.get('page') || '1', 10),
    });
  }, [searchParams]);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.category) params.set('category', filters.category);
      if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
      if (filters.condition) params.set('condition', filters.condition);
      if (filters.status) params.set('status', filters.status);
      if (filters.sort) params.set('sort', filters.sort);
      params.set('page', String(filters.page || 1));
      params.set('limit', '12');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch User Favorites for quick heart state
  useEffect(() => {
    async function loadFavorites() {
      try {
        const res = await fetch('/api/favorites');
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setFavorites(data.data);
        }
      } catch (err) {
        // silent
      }
    }
    loadFavorites();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (key: keyof FilterState | string, value: any) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value, page: 1 };
      // Push to URL
      const params = new URLSearchParams();
      Object.entries(next).forEach(([k, v]) => {
        if (v && v !== 'all') params.set(k, String(v));
      });
      router.push(`/products?${params.toString()}`, { scroll: false });
      return next;
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => {
      const next = { ...prev, page: newPage };
      const params = new URLSearchParams();
      Object.entries(next).forEach(([k, v]) => {
        if (v && v !== 'all') params.set(k, String(v));
      });
      router.push(`/products?${params.toString()}`, { scroll: false });
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    const defaultFilters: FilterState = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      status: 'Available',
      sort: 'newest',
      page: 1,
    };
    setFilters(defaultFilters);
    router.push('/products');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {filters.category ? filters.category : 'All Refurbished Tech'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {pagination.totalCount} verified items available for order or exchange.
          </p>
        </div>

        {/* Mobile Filter Toggle Button & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold shadow-2xs hover:bg-slate-50"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Filters</span>
          </button>

          <SortDropdown
            value={filters.sort || 'newest'}
            onChange={(val) => handleFilterChange('sort', val)}
          />
        </div>
      </div>

      {/* Main Layout: Filters Sidebar (Desktop) + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar (1 col) */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <ProductFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Product Grid Area (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <>
              <ProductGrid
                products={products}
                favorites={favorites}
                columns={3}
              />
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <EmptyState
              title="No devices match your criteria"
              description="We couldn't find any listings matching your active filters. Try clearing your price range or search terms."
              onAction={handleResetFilters}
              actionLabel="Clear All Filters"
            />
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over / Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs lg:hidden animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <Filter className="w-5 h-5 text-brand-600" />
                <span>Filters</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton count={8} />}>
      <ProductsContent />
    </Suspense>
  );
}
