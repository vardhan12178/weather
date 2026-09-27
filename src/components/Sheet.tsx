import { useEffect, useId, useRef, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { X } from 'lucide-react';
import IconButton from './IconButton';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  /** Extra content pinned under the title (e.g. a search field) */
  header?: ReactNode;
  /** Element to focus when the sheet opens (default: the browser picks the first control) */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /**
   * Fixed tall height instead of fitting the content. Use for sheets whose
   * content changes as you type (search), so the top never jumps around.
   */
  tall?: boolean;
}

const DISMISS_DISTANCE = 110;

/**
 * Bottom sheet on phones, centred panel on larger screens. Built on <dialog>,
 * so focus trapping, Esc-to-close and the modal backdrop come from the browser.
 * Drag the handle down to dismiss on touch screens.
 */
const Sheet = ({ open, onClose, title, children, header, initialFocusRef, tall = false }: SheetProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const drag = useRef<{ startY: number; dy: number } | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.style.transform = '';
      dialog.showModal();
      initialFocusRef?.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initialFocusRef]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { startY: e.clientY, dy: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !ref.current) return;
    drag.current.dy = Math.max(0, e.clientY - drag.current.startY);
    ref.current.style.transform = `translateY(${drag.current.dy}px)`;
  };
  const onPointerUp = () => {
    if (!drag.current || !ref.current) return;
    const dismissed = drag.current.dy > DISMISS_DISTANCE;
    drag.current = null;
    const dialog = ref.current;
    dialog.style.transition = 'transform 0.2s ease';
    dialog.style.transform = '';
    setTimeout(() => {
      dialog.style.transition = '';
    }, 200);
    if (dismissed) onClose();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the dialog element itself (not its content) is a backdrop click
      onClick={(e) => e.target === ref.current && onClose()}
      className={`fixed inset-0 mx-0 mb-0 mt-auto flex max-h-[88dvh] w-full max-w-none flex-col overflow-hidden rounded-t-[28px] bg-surface p-0 text-white shadow-2xl backdrop:bg-black/60 md:backdrop:backdrop-blur-[2px] not-open:hidden open:animate-sheet-up md:m-auto md:max-h-[80dvh] md:w-[min(34rem,calc(100%-2rem))] md:rounded-[28px] md:open:animate-fade-in ${
        tall ? 'h-[88dvh] md:h-[min(80dvh,42rem)]' : ''
      }`}
    >
      <div className="flex min-h-0 flex-1 flex-col pb-[env(safe-area-inset-bottom)]">
        {/* Drag handle (phones) */}
        <div
          className="flex h-6 shrink-0 touch-none items-center justify-center md:hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-hidden="true"
        >
          <span className="h-1.5 w-10 rounded-full bg-white/30" />
        </div>

        <div className="flex shrink-0 items-center gap-2 pl-5 pr-2 md:pt-3">
          <h2 id={titleId} className="min-w-0 flex-1 truncate text-headline font-semibold">
            {title}
          </h2>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>

        {header && <div className="shrink-0 px-5 pb-3 pt-1">{header}</div>}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6">{children}</div>
      </div>
    </dialog>
  );
};

export default Sheet;
