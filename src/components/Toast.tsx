import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import IconButton from './IconButton';

interface ToastProps {
  icon?: ReactNode;
  children: ReactNode;
  action?: { label: string; onClick: () => void };
  onDismiss?: () => void;
}

/** Small floating message; render inside <ToastArea>. */
export const Toast = ({ icon, children, action, onDismiss }: ToastProps) => (
  <div role="status" className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-surface-raised py-2 pl-4 pr-1 shadow-2xl ring-1 ring-white/10 animate-fade-up">
    {icon && <span className="shrink-0 text-white/85">{icon}</span>}
    <p className="min-w-0 flex-1 text-footnote">{children}</p>
    {action && (
      <button type="button" onClick={action.onClick} className="min-h-11 shrink-0 rounded-full px-3 text-footnote font-semibold text-sky-300 hover:bg-white/10">
        {action.label}
      </button>
    )}
    {onDismiss && (
      <IconButton label="Dismiss" onClick={onDismiss}>
        <X size={16} />
      </IconButton>
    )}
  </div>
);

/** Bottom-centre stack for toasts, above the home indicator */
export const ToastArea = ({ children }: { children: ReactNode }) => (
  <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex flex-col items-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
    {children}
  </div>
);
