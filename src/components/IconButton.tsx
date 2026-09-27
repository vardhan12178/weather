import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name — icon-only buttons must have one */
  label: string;
  children: ReactNode;
}

/** 44×44 round button (the minimum comfortable touch target) */
const IconButton = ({ label, children, className = '', ...props }: IconButtonProps) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/10 active:bg-white/20 disabled:opacity-40 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default IconButton;
