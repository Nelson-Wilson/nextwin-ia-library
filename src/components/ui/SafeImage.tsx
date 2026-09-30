import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  fallbackTitle,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-slate-900 border border-slate-800 text-slate-400 p-4 text-center select-none ${containerClassName || className}`}
      >
        <BookOpen className="w-8 h-8 mb-2 text-indigo-400 opacity-60" />
        <span className="text-xs font-medium text-slate-300 max-w-[140px] truncate">
          {fallbackTitle || alt || 'NextWin Library'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
};
