'use client';

import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import SupportModal from '@/components/forms/SupportModal';

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open support panel"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-brand-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-slate-700/50"
        >
          <div className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-wide">
            Help & Support
          </span>
        </button>
      </div>

      <SupportModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
