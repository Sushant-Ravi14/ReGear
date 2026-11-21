import ProductForm from '@/components/forms/ProductForm';
import { DEMO_USERS } from '@/lib/demoUser';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Your Tech | ReGear Refurbished Marketplace',
  description: 'List your pre-owned smartphone, laptop, console, or computer accessory for free on ReGear.',
};

export default function SellPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500">
              Posting as: <strong className="text-slate-800">{DEMO_USERS.seller.name}</strong>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            List Your Tech Device
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
            Fill in the device details, upload clear photos, and complete our transparency checklist to reach thousands of buyers across India.
          </p>
        </div>
      </div>

      {/* Listing Form */}
      <ProductForm isEditing={false} />
    </div>
  );
}
