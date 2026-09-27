// Shared class names. Day/night colours come from the `dark` class that
// pages/Home.tsx sets on <html> at night, so components don't need colour props.

export const textPrimary = 'text-slate-900 dark:text-slate-100';
export const textSecondary = 'text-slate-600 dark:text-slate-300';

/** Glass card — borderless on phones, a floating card from `md` up */
export const cardClass =
  'rounded-[2.5rem] md:bg-white/70 md:backdrop-blur-2xl md:border md:border-white/60 md:shadow-[0_20px_60px_rgba(15,23,42,0.12)] ' +
  'md:dark:bg-slate-950/35 md:dark:border-white/15 md:dark:shadow-[0_20px_60px_rgba(2,6,23,0.5)]';

export const sectionTitle = `${textPrimary} font-extrabold text-[10px] uppercase tracking-widest opacity-60`;

export const iconButton =
  'w-9 h-9 rounded-full flex items-center justify-center transition-all border active:scale-95 shadow-xs ' +
  'bg-slate-950/5 hover:bg-slate-950/10 border-slate-950/5 text-slate-800 ' +
  'dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/10 dark:text-white disabled:opacity-50';
