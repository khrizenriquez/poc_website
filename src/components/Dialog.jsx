import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
export default function Dialog({ title, onClose, children }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current.querySelector('button').focus();
    const keydown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const focusable = ref.current.querySelectorAll('button, a[href], input, select, textarea');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', keydown);
      previous.focus();
    };
  }, [onClose]);
  return (
    <div
      className="dialog-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={ref}
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <button
          className="icon-button dialog-close"
          onClick={onClose}
          aria-label={t('errors.detailClose')}
        >
          ×
        </button>
        <h2 id="dialog-title">{title}</h2>
        {children}
      </section>
    </div>
  );
}
