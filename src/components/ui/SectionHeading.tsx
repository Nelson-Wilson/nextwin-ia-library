import React from 'react';
import { Link } from 'react-router-dom';

export const SectionHeading: React.FC<{
  eyebrow?: string;
  title: string;
  linkText?: string;
  linkTo?: string;
}> = ({ eyebrow, title, linkText, linkTo }) => (
  <div className="flex items-end justify-between gap-4 mb-6">
    <div>
      {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-wider text-brand mb-1">{eyebrow}</p>}
      <h2 className="text-xl sm:text-2xl font-extrabold text-ink">{title}</h2>
    </div>
    {linkText && linkTo && (
      <Link to={linkTo} className="text-xs font-semibold text-brand hover:text-brand-strong whitespace-nowrap">
        {linkText} &rarr;
      </Link>
    )}
  </div>
);
