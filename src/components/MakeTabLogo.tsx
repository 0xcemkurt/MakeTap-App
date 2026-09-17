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
      {/* App Icon Container */}
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] shadow-md shadow-blue-500/20 shrink-0 ${currentSizeClass}`}
      >
        <img
          src="/MakeTab.png"
          alt="MakeTab Logo"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to high-precision collar SVG if image load fails
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.nextElementSibling) {
              (target.nextElementSibling as HTMLElement).style.display = 'block';
            }
          }}
        />
        {/* Crisp vector fallback of the white school collar on blue */}
        <div style={{ display: 'none' }} className="w-full h-full p-2">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Collar shape matching Turkish school uniform collar */}
            <path
              d="M 20 38 C 24 30, 40 28, 50 28 C 60 28, 76 30, 80 38 C 84 52, 70 70, 53 72 C 51 72, 49 72, 47 72 C 30 70, 16 52, 20 38 Z"
              fill="white"
            />
            {/* Center collar split line */}
            <path
              d="M 50 35 L 50 72"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Inner lapel depth */}
            <path
              d="M 36 32 C 43 36, 57 36, 64 32 C 60 46, 40 46, 36 32 Z"
              fill="#1d4ed8"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-xl sm:text-2xl ${textColor} font-sans`}>
              Make<span className="text-blue-600">Tab</span>
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-full">
              TR
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
