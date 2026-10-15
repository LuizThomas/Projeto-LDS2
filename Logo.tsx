import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = false,
  showText = true,
  className = '',
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return 'w-7 h-7';
      case 'md':
        return 'w-9 h-9';
      case 'lg':
        return 'w-16 h-16';
      case 'xl':
        return 'w-24 h-24';
      default:
        return 'w-9 h-9';
    }
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official IFCE Emblem: Red dot + Green 'i' stems + Green 'v' polygon */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 100 100"
          className={`${getDimensions()} drop-shadow-xs transition-transform`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Logo IFCE IV"
        >
          {/* Red Accent Dot (topo do 'i') */}
          <circle cx="28" cy="22" r="14" fill="#dc2626" />

          {/* Green blocks formando o corpo vertical do 'i' */}
          <rect x="14" y="44" width="28" height="24" rx="4" fill="#16a34a" />
          <rect x="14" y="74" width="28" height="24" rx="4" fill="#16a34a" />

          {/* Green 'v' estilizado em harmonia visual com o padrão IFCE */}
          <path
            d="M 50 44 L 62 44 L 72 82 L 82 44 L 94 44 L 80 98 L 64 98 Z"
            fill="#16a34a"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center leading-none">
            <span
              className={`font-black tracking-tight ${
                size === 'sm'
                  ? 'text-lg'
                  : size === 'md'
                  ? 'text-2xl'
                  : size === 'lg'
                  ? 'text-3xl'
                  : 'text-4xl'
              }`}
            >
              <span className="text-[#16a34a]">i</span>
              <span className="text-[#15803d]">ventus</span>
            </span>
          </div>
          {showSubtitle && (
            <span className="text-xs font-medium text-slate-500 mt-1">
              Plataforma de eventos científicos do IFCE
            </span>
          )}
        </div>
      )}
    </div>
  );
};
