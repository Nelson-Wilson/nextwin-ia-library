import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { ButtonLink } from '../ui/Button';
import { ShieldCheck, Zap, Infinity as InfinityIcon, BookOpen, Briefcase, TrendingUp } from 'lucide-react';
import heroWoman from '../../assets/images/hero_woman_crop.jpg';

const floating = [
  { label: 'Estude melhor', icon: BookOpen, tone: 'text-brand bg-brand-soft', pos: 'lg:top-[16%] lg:left-0' },
  { label: 'Trabalhe com mais produtividade', icon: Briefcase, tone: 'text-brand bg-brand-soft', pos: 'lg:top-[40%] lg:left-0' },
  { label: 'Crie sua renda extra', icon: TrendingUp, tone: 'text-violet bg-violet-100', pos: 'lg:top-[64%] lg:left-0' },
];

const trust = [
  { icon: ShieldCheck, title: 'Pagamento seguro', sub: '(EscalePay)', tone: 'text-brand' },
  { icon: Zap, title: 'Entrega imediata', sub: 'por email', tone: 'text-violet' },
  { icon: InfinityIcon, title: 'Acesso vitalício', sub: 'aos seus produtos', tone: 'text-brand' },
];

/** Splits the editable headline so the "para …" part is highlighted, as in the reference. */
const renderHeadline = (text: string) => {
  const idx = text.indexOf(' para ');
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx + 6)}
      <span className="text-brand">{text.slice(idx + 6)}</span>
    </>
  );
};

export const Hero: React.FC = () => {
  const { settings } = useSettings();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-white to-brand-soft/70">
      <div className="absolute -right-24 top-0 w-[420px] h-[420px] rounded-full bg-violet-200/40 blur-3xl pointer-events-none" />
      <div className="absolute right-40 bottom-0 w-[260px] h-[260px] rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 lg:pt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
        <div className="pb-8 lg:pb-14 space-y-5 self-center">
          <span className="inline-block rounded-full bg-brand-soft text-brand text-[10px] font-bold tracking-wider px-3 py-1 uppercase">
            Sua jornada começa aqui
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] leading-[1.12] font-extrabold text-ink text-balance">
            {renderHeadline(settings.hero_headline)}
          </h1>
          <p className="text-sm text-muted leading-relaxed max-w-md">{settings.hero_subheadline}</p>
          <ButtonLink to="/produtos" arrow size="md">
            {settings.hero_cta_text}
          </ButtonLink>

          <div className="flex flex-wrap gap-3 pt-2">
            {trust.map((t) => (
              <div key={t.title} className="flex items-center gap-2.5 bg-white border border-line rounded-xl px-3 py-2 shadow-card">
                <t.icon className={`w-5 h-5 ${t.tone}`} strokeWidth={1.75} />
                <div className="text-[10px] leading-tight text-muted">
                  <span className="block font-semibold text-ink">{t.title}</span>
                  {t.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col items-center lg:block lg:h-[440px]">
          <img
            src={heroWoman}
            alt="Jovem a estudar com um portátil"
            className="relative z-0 w-[240px] sm:w-[280px] lg:absolute lg:bottom-0 lg:right-12 lg:w-[300px] h-auto object-contain [mask-image:linear-gradient(to_bottom,transparent,black_10%),linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] [mask-composite:intersect]"
          />
          <div className="relative z-10 w-full flex flex-col gap-2.5 mt-4 lg:mt-0 lg:block lg:absolute lg:inset-0 lg:pointer-events-none">
            {floating.map((f) => (
              <div
                key={f.label}
                className={`flex items-center gap-3 bg-white rounded-xl border border-line shadow-soft px-3.5 py-2.5 lg:absolute lg:w-[175px] lg:pointer-events-auto ${f.pos}`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${f.tone}`}>
                  <f.icon className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-bold text-ink leading-tight">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
