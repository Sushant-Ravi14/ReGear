'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CATEGORIES, CONDITIONS } from '@/constants/categories';
import { useToast } from '@/components/ui/ToastNotifications';
import {
  UploadCloud,
  X,
  Plus,
  Shield,
  MapPin,
  Tag,
  Info,
} from 'lucide-react';

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function ProductForm({
  initialData = null,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    category: initialData?.category || 'Smartphones',
    price: initialData?.price || '',
    originalPrice: initialData?.originalPrice || '',
    condition: initialData?.condition || 'Like New',
    location: initialData?.location || 'Bengaluru, Karnataka',
    description: initialData?.description || '',
    images: initialData?.images || [] as string[],
    specs: {
      warranty: initialData?.specs?.warranty || '30 Days ReGear Warranty',
      shipping: initialData?.specs?.shipping || 'Express Shipping & Local Pickup',
      returnPolicy: initialData?.specs?.returnPolicy || '7 Days Replacement Policy',
    },
    conditionChecklist: {
      fullyFunctional: initialData?.conditionChecklist?.fullyFunctional ?? true,
      screenCondition: initialData?.conditionChecklist?.screenCondition || 'Zero scratches or dead pixels',
      bodyCondition: initialData?.conditionChecklist?.bodyCondition || 'Minimal cosmetic signs of use',
      batteryHealth: initialData?.conditionChecklist?.batteryHealth || '85%+ battery health tested',
      accessoriesIncluded: initialData?.conditionChecklist?.accessoriesIncluded || 'Original or compatible charging cable',
      originalBox: initialData?.conditionChecklist?.originalBox ?? false,
      repairHistory: initialData?.conditionChecklist?.repairHistory || 'Clean diagnostic check; never liquid damaged',
    },
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, any>>({});

  const handleAddImageUrl = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;

    if (!imageUrlInput.startsWith('http://') && !imageUrlInput.startsWith('https://')) {
      addToast('Please enter a valid HTTP/HTTPS image URL', 'error');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
    addToast('Image added to gallery preview', 'info');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let uploadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadData = new FormData();
      uploadData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, data.url],
          }));
          uploadedCount++;
        } else {
          addToast(data.error || 'Failed to upload image', 'error');
        }
      } catch (err) {
        addToast('Network error uploading file', 'error');
      }
    }

    setIsUploading(false);
    if (uploadedCount > 0) {
      addToast(`Uploaded ${uploadedCount} image(s) successfully`, 'success');
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.brand.trim()) errs.brand = 'Brand is required';
    if (!formData.description.trim() || formData.description.length < 10) {
      errs.description = 'Description must be at least 10 characters';
    }
    if (!formData.price || Number(formData.price) <= 0) {
      errs.price = 'Selling price must be greater than 0';
    }
    if (formData.images.length === 0) {
      errs.images = 'Please add or upload at least one image';
    }
    if (!formData.location.trim()) errs.location = 'Location is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please complete all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        title: formData.title,
        brand: formData.brand,
        model: formData.model,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : 0,
        condition: formData.condition,
        location: formData.location,
        description: formData.description,
        images: formData.images,
        specs: formData.specs,
        conditionChecklist: formData.conditionChecklist,
      };

      const url = isEditing
        ? `/api/products/${initialData._id}`
        : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        addToast(
          isEditing
            ? 'Listing successfully updated!'
            : 'Device listed on ReGear marketplace!',
          'success'
        );
        router.push(isEditing ? `/products/${initialData._id}` : '/dashboard/listings');
        router.refresh();
      } else {
        addToast(data.error || 'Failed to save listing', 'error');
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (err) {
      addToast('An unexpected network error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Basic Product Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">General Information</h3>
            <p className="text-xs text-slate-500">Provide the model name and core specifications.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Product Listing Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apple iPhone 13 128GB - Midnight (Flawless)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 transition-all ${
                errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Brand <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Apple, Dell, Sony, Samsung"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
            {errors.brand && <p className="text-xs text-rose-500 mt-1">{errors.brand}</p>}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Model Number / Variant
            </label>
            <input
              type="text"
              placeholder="e.g. A2633 / 128GB Midnight"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-white"
            >
              {CATEGORIES.filter((c) => c.slug !== 'all').map((cat) => (
                <option key={cat.id} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Cosmetic & Operational Condition <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-white"
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Selling Price (₹) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                required
                min="1"
                placeholder="24999"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full pl-9 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 font-semibold"
              />
            </div>
            {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Original Retail Price (₹) (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                min="0"
                placeholder="49900"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full pl-9 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Used to calculate discount badge.</p>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Location / City <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. Bengaluru, Karnataka or Koramangala, Bengaluru"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Description & Highlights <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe the usage duration, reason for selling, accessories included, performance, and cosmetic state..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500 resize-none"
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
          </div>
        </div>
      </div>

      {/* 2. Image Upload & Gallery */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Product Photos</h3>
            <p className="text-xs text-slate-500">
              Upload photos via Cloudinary / Local storage or provide direct image links.
            </p>
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 sm:p-8 text-center hover:border-brand-500 transition-colors bg-slate-50/50">
          <input
            type="file"
            id="product-images"
            multiple
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
          <label htmlFor="product-images" className="cursor-pointer block">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3 border border-brand-100 shadow-2xs">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="font-bold text-slate-800 text-sm mb-1">
              {isUploading ? 'Uploading file(s)...' : 'Click to upload files'}
            </p>
            <p className="text-xs text-slate-400">
              Supports JPG, PNG, WebP up to 5MB each.
            </p>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="url"
            placeholder="Or paste an image URL (https://...)"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add URL
          </button>
        </div>

        {formData.images.length > 0 ? (
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Uploaded Images ({formData.images.length})
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.images.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square shadow-2xs"
                >
                  <Image
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    fill
                    sizes="160px"
                    className="object-contain p-2"
                  />
                  {idx === 0 && (
                    <span className="absolute top-2 left-2 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-800 text-xs">
            <Info className="w-5 h-5 shrink-0 text-amber-600" />
            <span>Please add at least one image so buyers can inspect your device.</span>
          </div>
        )}
      </div>

      {/* 3. Detailed Condition Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Condition Checklist & Transparency</h3>
            <p className="text-xs text-slate-500">
              Only declare details you have personally verified. Builds trust with buyers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-brand-500 cursor-pointer transition-colors bg-slate-50/50">
              <input
                type="checkbox"
                checked={formData.conditionChecklist.fullyFunctional}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    conditionChecklist: {
                      ...formData.conditionChecklist,
                      fullyFunctional: e.target.checked,
                    },
                  })
                }
                className="w-5 h-5 text-brand-600 rounded-lg border-slate-300 focus:ring-brand-500"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">100% Fully Functional</p>
                <p className="text-xs text-slate-500">
                  All ports, Wi-Fi, Bluetooth, buttons, speakers, and cameras operate normally.
                </p>
              </div>
            </label>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Screen Condition
            </label>
            <input
              type="text"
              value={formData.conditionChecklist.screenCondition}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  conditionChecklist: {
                    ...formData.conditionChecklist,
                    screenCondition: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Body / Frame Condition
            </label>
            <input
              type="text"
              value={formData.conditionChecklist.bodyCondition}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  conditionChecklist: {
                    ...formData.conditionChecklist,
                    bodyCondition: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Battery Health
            </label>
            <input
              type="text"
              value={formData.conditionChecklist.batteryHealth}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  conditionChecklist: {
                    ...formData.conditionChecklist,
                    batteryHealth: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Included Accessories
            </label>
            <input
              type="text"
              value={formData.conditionChecklist.accessoriesIncluded}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  conditionChecklist: {
                    ...formData.conditionChecklist,
                    accessoriesIncluded: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Repair & Modification History
            </label>
            <input
              type="text"
              value={formData.conditionChecklist.repairHistory}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  conditionChecklist: {
                    ...formData.conditionChecklist,
                    repairHistory: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Form Submission Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Saving Listing...</span>
            </>
          ) : (
            <span>{isEditing ? 'Save Changes' : 'Publish Listing'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
