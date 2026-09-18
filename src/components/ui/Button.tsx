import React from 'react';

export type ButtonVariant = 'primary' | 'success' | 'indigo' | 'secondary' | 'softBrand' | 'softIndigo' | 'ghost' | 'ghostDark' | 'danger' | 'amber' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

const variantMap: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white shadow-sm shadow-brand-600/25 hover:bg-brand-700',
  success: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25 hover:bg-emerald-700',
  indigo: 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700',
  secondary:
    'bg-white text-slate-700 border border-slate-200 shadow-xs hover:bg-slate-50 hover:border-slate-300',
  softBrand: 'bg-brand-50 text-brand-700 border border-brand-100 hover:bg-brand-100',
  softIndigo: 'bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100',
  ghost:
    'bg-slate-100 text-slate-600 border border-slate-200/80 hover:bg-slate-200/70 hover:text-slate-900',
  ghostDark: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
  danger: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100',
  amber:
    'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-amber-400',
  dark: 'bg-slate-900 text-white shadow-md hover:bg-slate-700',
};

const sizeMap: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1.5 rounded-xl text-xs',
  md: 'px-3 py-2.5 rounded-xl text-xs',
  lg: 'px-4 py-3 rounded-2xl text-xs sm:text-sm',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** MakeTab standart butonu — tüm birincil/ikincil aksiyonlarda bunu kullan. */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...rest
}) => (
  <button
    type={type}
    className={`font-black transition-all items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 inline-flex ${variantMap[variant]} ${sizeMap[size]} ${className}`}
    {...rest}
  />
);
