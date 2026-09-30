import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type Variant = 'cta' | 'primary' | 'outline' | 'light';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  cta: 'bg-cta hover:bg-cta-strong text-white shadow-[0_6px_18px_rgba(0,208,132,0.28)]',
  primary: 'bg-brand hover:bg-brand-strong text-white shadow-[0_6px_18px_rgba(37,99,235,0.25)]',
  outline: 'bg-white border border-brand text-brand hover:bg-brand-soft',
  light: 'bg-white text-navy hover:bg-brand-soft',
};
const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

interface Common {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  full?: boolean;
  className?: string;
  children: React.ReactNode;
}

const cls = ({ variant = 'cta', size = 'md', full, className = '' }: Omit<Common, 'children'>) =>
  `inline-flex items-center justify-center gap-2 rounded-xl font-bold whitespace-nowrap transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`;

export const ButtonLink: React.FC<Common & { to: string }> = ({ to, arrow, children, ...rest }) => (
  <Link to={to} className={cls(rest)}>
    {children}
    {arrow && <ArrowRight className="w-4 h-4" />}
  </Link>
);

export const Button: React.FC<Common & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  variant, size, full, className, arrow, children, ...props
}) => (
  <button {...props} className={cls({ variant, size, full, className })}>
    {children}
    {arrow && <ArrowRight className="w-4 h-4" />}
  </button>
);
