import React from 'react';
import { Link } from 'react-router-dom';

export const Logo: React.FC<{ light?: boolean }> = ({ light }) => (
  <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="NextWin AI Library">
    <svg viewBox="0 0 40 40" className="w-9 h-9" aria-hidden="true">
      <defs>
        <linearGradient id="nwg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path d="M6 34V6h7l14 18V6h7v28h-7L13 16v18z" fill="url(#nwg)" />
    </svg>
    <span className="leading-none">
      <span className={`block text-[15px] font-extrabold tracking-tight ${light ? 'text-white' : 'text-navy'}`}>NEXTWIN AI</span>
      <span className={`block text-[9px] tracking-[0.3em] mt-0.5 ${light ? 'text-blue-200' : 'text-muted'}`}>LIBRARY</span>
    </span>
  </Link>
);
