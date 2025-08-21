import React, { useEffect, useRef } from 'react';
import './Modal.css';

export default function Modal({ isOpen, onClose, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKeyDown);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);
  
  const stop = (e) => e.stopPropagation();

  if (!isOpen) return null;

  return (
    <div className="Modal" onClick={onClose}>
      <div
        ref={dialogRef}
        className="modalContent"
        role="dialog"
        aria-modal="true"
        onClick={stop}
      >
        <button
          type="button"
          className="modalClose"
          aria-label="닫기"
          onClick={(e) => { e.stopPropagation(); onClose?.(); }}
        >
          ✖
        </button>

        {children}
      </div>
    </div>
  );
}
