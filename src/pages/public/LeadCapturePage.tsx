import React from 'react';
import { LeadCapture } from '../../components/marketing/LeadCapture';
import { ShieldCheck } from 'lucide-react';

export const LeadCapturePage: React.FC = () => (
  <div className="min-h-[70vh] py-16 px-4 sm:px-6 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-brand-soft/60 to-white">
    <div className="w-full">
      <LeadCapture variant="page" />
    </div>
    <p className="text-[11px] text-muted flex items-center gap-1.5">
      <ShieldCheck className="w-3.5 h-3.5 text-cta-strong" />
      Privacidade protegida. Não enviamos spam.
    </p>
  </div>
);
