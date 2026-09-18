import React from 'react';

export type BadgeTone = 'blue' | 'brand' | 'amber' | 'amberSoft' | 'emerald' | 'rose' | 'roseSoft' | 'slate' | 'indigo';

const toneMap: Record<BadgeTone, string> = {
  blue: 'bg-blue-100 text-blue-700',
  brand: 'bg-brand-100 text-brand-700',
  amber: 'bg-amber-400 text-slate-950',
  amberSoft: 'bg-amber-100 text-amber-800',
  emerald: 'bg-emerald-100 text-emerald-700',
  rose: 'bg-rose-100 text-rose-700',
  roseSoft: 'bg-rose-100 text-rose-800',
  slate: 'bg-slate-100 text-slate-600',
  indigo: 'bg-indigo-100 text-indigo-700',
};

export interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
  title?: string;
  /** Uzun metinlerde (örn. partner adı) satır kaydırmaya izin ver */
  wrap?: boolean;
}

/** Küçük durum/etiket rozeti (sınıf, rol, durum). */
export const Badge: React.FC<BadgeProps> = ({ tone = 'slate', children, className = '', title, wrap = false }) => (
  <span
    title={title}
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${wrap ? 'whitespace-normal text-left leading-snug max-w-full break-words' : 'whitespace-nowrap'} ${toneMap[tone]} ${className}`}
  >
    {children}
  </span>
);
