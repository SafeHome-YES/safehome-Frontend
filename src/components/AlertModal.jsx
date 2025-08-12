import React from 'react';
import Modal from './Modal.jsx';
import './AlertModal.css';

export default function AlertModal({
    isOpen,
    onClose,
    title = '알림',
    message,
    confirmText = '확인'
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="alert-modal">
                <div className="alert-texts">
                    <h4>{title}</h4>
                    {message && <p>{message}</p>}
                </div>
                <div className="alert-actions">
                    <button className="alert-btn" onClick={onClose}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
