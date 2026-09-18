import React from 'react';

export interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'className' | 'size'
> {
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  /** light: beyaz zemin formu · dark: müdür paneli koyu formu */
  tone?: 'light' | 'dark';
  mono?: boolean;
  radius?: 'xl' | '2xl';
  inputClassName?: string;
}

/** Etiket + ikon destekli standart metin girişi (login formları bunu kullanır). */
export const TextInput: React.FC<TextInputProps> = ({
  leftIcon,
  rightSlot,
  tone = 'light',
  mono = false,
  radius = '2xl',
  inputClassName = '',
  ...rest
}) => (
  <div className="relative">
    {leftIcon && (
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 [&>svg]:w-4 [&>svg]:h-4">
        {leftIcon}
      </span>
    )}
    <input
      className={`w-full py-2.5 text-xs sm:text-sm font-semibold transition-all focus:outline-hidden ${
        leftIcon ? 'pl-10' : 'pl-3'
      } ${rightSlot ? 'pr-10' : 'pr-3'} ${radius === 'xl' ? 'rounded-xl' : 'rounded-2xl'} ${
        tone === 'dark'
          ? 'bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400'
          : 'bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
      } ${mono ? 'font-mono' : ''} ${inputClassName}`}
      {...rest}
    />
    {rightSlot && (
      <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</span>
    )}
  </div>
);
