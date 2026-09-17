import React from 'react';

interface StudentAvatarProps {
  name: string;
  color: string;
  shape?: string;
  points?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
  isBouncing?: boolean;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  name,
  color,
  points,
  size = 'md',
  showBadge = true,
  className = '',
  isBouncing = false,
}) => {
  // Deterministic seed from name for varied features
  const charCode = name.charCodeAt(0) + (name.length * 7);
  const eyeType = charCode % 3; // 0: big two eyes, 1: cyclops (one giant eye), 2: sleepy cute eyes
  const hornType = charCode % 4; // 0: cute antenna, 1: double little horns, 2: tuft hair, 3: rounded ears

  const dimensions = {
    sm: { box: 'w-10 h-10', badge: 'text-[10px] w-5 h-5 -top-1 -right-1', svgSize: 40 },
    md: { box: 'w-16 h-16', badge: 'text-xs w-6 h-6 -top-1.5 -right-1.5', svgSize: 64 },
    lg: { box: 'w-24 h-24', badge: 'text-sm w-8 h-8 -top-2 -right-2', svgSize: 96 },
    xl: { box: 'w-32 h-32', badge: 'text-base w-10 h-10 -top-2.5 -right-2.5', svgSize: 128 },
  };

  const dim = dimensions[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <div
        className={`${dim.box} rounded-3xl transition-transform duration-300 flex items-center justify-center p-1 relative overflow-visible ${
          isBouncing ? 'animate-bounce scale-110' : 'hover:scale-105'
        }`}
        style={{
          backgroundColor: `${color}18`, // Soft background tint
          boxShadow: `0 4px 14px ${color}25`,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm transition-transform duration-200"
        >
          <defs>
            <linearGradient id={`grad-${name}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={`${color}dd`} />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* Monster Body Shapes */}
          {hornType === 1 && (
            // Double horns
            <g fill="#f59e0b">
              <polygon points="26,30 20,12 36,24" />
              <polygon points="74,30 80,12 64,24" />
            </g>
          )}

          {hornType === 0 && (
            // Antenna with glowing star/bulb
            <g>
              <path d="M 50 30 Q 55 16 50 12" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" />
              <circle cx="50" cy="10" r="5" fill="#fbbf24" />
            </g>
          )}

          {hornType === 2 && (
            // Hair tufts
            <g fill={color}>
              <path d="M 45 28 Q 42 16 48 18 Q 50 14 54 18 Q 58 16 55 28 Z" />
            </g>
          )}

          {/* Body Main Blob */}
          <path
            d="M 22 45 C 22 26, 78 26, 78 45 C 84 62, 80 84, 50 84 C 20 84, 16 62, 22 45 Z"
            fill={`url(#grad-${name})`}
            filter="url(#shadow)"
          />

          {/* Belly pattern */}
          <ellipse cx="50" cy="66" rx="18" ry="12" fill="white" opacity="0.3" />

          {/* Eyes */}
          {eyeType === 1 ? (
            // Big Cyclops Eye
            <g>
              <circle cx="50" cy="46" r="14" fill="white" />
              <circle cx="50" cy="46" r="7" fill="#1e293b" />
              <circle cx="53" cy="43" r="2.5" fill="white" />
            </g>
          ) : (
            // Two expressive eyes
            <g>
              <circle cx="40" cy="46" r="8" fill="white" />
              <circle cx="60" cy="46" r="8" fill="white" />
              <circle cx="41" cy="46" r="4.5" fill="#1e293b" />
              <circle cx="61" cy="46" r="4.5" fill="#1e293b" />
              <circle cx="43" cy="44" r="1.8" fill="white" />
              <circle cx="63" cy="44" r="1.8" fill="white" />
            </g>
          )}

          {/* Cheeks */}
          <circle cx="30" cy="56" r="4" fill="#f43f5e" opacity="0.4" />
          <circle cx="70" cy="56" r="4" fill="#f43f5e" opacity="0.4" />

          {/* Happy Smile / Mouth */}
          <path
            d="M 42 58 Q 50 67 58 58"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Small tongue */}
          <path d="M 47 62 Q 50 67 53 62 Z" fill="#fb7185" />
        </svg>
      </div>

      {/* Point Badge (ClassDojo style green/yellow circle) */}
      {showBadge && typeof points === 'number' && (
        <span
          className={`absolute ${dim.badge} font-black rounded-full flex items-center justify-center text-white border-2 border-white shadow-md transform transition-all duration-300 ${
            points >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        >
          {points}
        </span>
      )}
    </div>
  );
};
