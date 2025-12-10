import React from 'react';

interface VibeMapLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const VibeMapLogo: React.FC<VibeMapLogoProps> = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 40, text: 'text-xl' },
    md: { icon: 64, text: 'text-2xl' },
    lg: { icon: 80, text: 'text-3xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Pin shape */}
        <path
          d="M32 4C20.954 4 12 12.954 12 24C12 38 32 60 32 60C32 60 52 38 52 24C52 12.954 43.046 4 32 4Z"
          className="fill-accent"
        />
        {/* Sound waves inside */}
        <g className="stroke-accent-foreground" strokeWidth="2.5" strokeLinecap="round">
          <path d="M26 28C26 28 24 26 24 22C24 18 26 16 26 16" />
          <path d="M32 30C32 30 28 27 28 22C28 17 32 14 32 14" />
          <path d="M38 28C38 28 40 26 40 22C40 18 38 16 38 16" />
        </g>
        {/* Gradient overlay for depth */}
        <defs>
          <linearGradient id="pinGradient" x1="12" y1="4" x2="52" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(280, 70%, 55%)" />
            <stop offset="1" stopColor="hsl(330, 80%, 55%)" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span className={`font-bold ${text} text-foreground`}>
          VibeMap
        </span>
      )}
    </div>
  );
};

export default VibeMapLogo;
