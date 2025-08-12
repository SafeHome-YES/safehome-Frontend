import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null; // 안 열려 있으면 렌더링 안 함

  return (
    <div className="Modal" onClick={onClose}>
      <div className="modalBody" onClick={(e) => e.stopPropagation()}>
        <button id="modalCloseBtn" onClick={onClose}>
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;