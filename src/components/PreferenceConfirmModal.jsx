import { useMemo } from 'react';
import Modal from './Modal.jsx';
import './PreferenceConfirmModal.css';

export default function SavePreferenceModal({
  isOpen,
  onClose,
  onConfirm,
  prefs = {},
}) {
  const {
    priceText,
    regions = [],
    commute = {},
    features = [],
    priority = [],
  } = prefs || {};

  const commuteText = useMemo(() => {
    const parts = [];
    if (commute.line) parts.push(commute.line);
    if (commute.station) parts.push(commute.station);
    if (commute.maxMin != null) parts.push(`~${commute.maxMin}분`);
    return parts.join(' · ');
  }, [commute]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="spm-root" onClick={(e) => e.stopPropagation()}>
        <header className="spm-header">
          <h3 className="spm-title">선호도 저장</h3>
          <p className="spm-sub">입력한 항목이 맞는지 확인해 주세요.</p>
        </header>

        <div className="spm-body">
          {priceText && (
            <div className="spm-row">
              <div className="spm-k">예산</div>
              <div className="spm-v">{priceText}</div>
            </div>
          )}
          {regions.length > 0 && (
            <div className="spm-row">
              <div className="spm-k">지역</div>
              <div className="spm-v spm-tags">
                {regions.map((r, i) => (
                  <span className="spm-tag" key={`${r}-${i}`}>{r}</span>
                ))}
              </div>
            </div>
          )}
          {commuteText && (
            <div className="spm-row">
              <div className="spm-k">통근</div>
              <div className="spm-v">{commuteText}</div>
            </div>
          )}
          {features.length > 0 && (
            <div className="spm-row">
              <div className="spm-k">안전/편의</div>
              <div className="spm-v spm-tags">
                {features.map((f, i) => (
                  <span className="spm-tag" key={`${f}-${i}`}>{f}</span>
                ))}
              </div>
            </div>
          )}
          {priority.length > 0 && (
            <div className="spm-row">
              <div className="spm-k">우선순위</div>
              <div className="spm-v spm-tags">
                {priority.map((p, i) => (
                  <span className="spm-tag spm-strong" key={`${p}-${i}`}>{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="spm-actions">
          <button className="spm-btn" onClick={onClose}>수정하기</button>
          <button
            className="spm-btn spm-primary"
            onClick={() => onConfirm?.(prefs)}
          >
            저장하기
          </button>
        </footer>
      </div>
    </Modal>
  );
}
