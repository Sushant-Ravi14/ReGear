'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images?: string[];
  title?: string;
}

export default function ProductGallery({ images = [], title = 'Product Image' }: ProductGalleryProps) {
  const imageList = Array.isArray(images) && images.length > 0
    ? images
    : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'];

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(imageList[0]);

  const handleSelect = (img: string, idx: number) => {
    setActiveIndex(idx);
    setActiveImage(img);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Frame */}
      <div className="relative w-full pt-[75%] sm:pt-[70%] bg-slate-50 rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs flex items-center justify-center">
        <Image
          src={activeImage}
          alt={`${title} - View ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6 transition-all duration-300"
          onError={() => {
            setActiveImage('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80');
          }}
        />
      </div>

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(img, idx)}
              className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? 'border-brand-600 ring-2 ring-brand-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1.5 bg-slate-50"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
