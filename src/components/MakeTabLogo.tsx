import React from 'react';

interface MakeTabLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  showText?: boolean;
  textColor?: string;
  subtext?: string;
}

export const MakeTabLogo: React.FC<MakeTabLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  textColor = 'text-slate-900',
  subtext = 'Dijital Mektep & Sınıf',
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-14 h-14 rounded-3xl',
    xl: 'w-20 h-20 rounded-[28px]',
    custom: '',
  };

  const currentSizeClass = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* App Icon */}
      <img
        src="/MakeTab.png"
        alt="MakeTab Logo"
        className={`shrink-0 object-contain drop-shadow-sm select-none ${currentSizeClass}`}
      />

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-xl sm:text-2xl ${textColor} font-sans`}>
              Make<span className="text-brand-600">Tab</span>
            </span>
          </div>
          {subtext && (
            <span className="text-xs text-slate-500 font-medium tracking-tight -mt-0.5">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
