import { useState } from 'react';
import Modal from './Modal';
import './PropertyDetailModal.css';

export default function PropertyDetailPanel({ isOpen, onClose, property }) {
  const p = property || {};
  const images = p.images?.filter(Boolean) ?? [];
  const [idx, setIdx] = useState(0);

  const next = () => setIdx((i) => (images.length ? (i + 1) % images.length : 0));
  const prev = () => setIdx((i) => (images.length ? (i - 1 + images.length) % images.length : 0));

  return (
   <Modal isOpen={isOpen} onClose={onClose} className="property-side-modal">

      {/* 이 래퍼가 있으면 .modalBody가 사이드 패널 레이아웃으로 전환됨 */}
      <div className="property-panel">
        {/* 상단 헤더 */}
        <header className="pp-header">
          <h2 className="pp-title">{p.title || '매물 제목'}</h2>
        </header>

        {/* 이미지 영역 (좌우 화살표) */}
        <section className="pp-gallery">
          {images.length ? (
            <>
              <img src={images[idx]} alt={`매물 이미지 ${idx + 1}/${images.length}`} />
              {images.length > 1 && (
                <>
                  <button className="pp-nav pp-prev" onClick={prev} aria-label="이전">‹</button>
                  <button className="pp-nav pp-next" onClick={next} aria-label="다음">›</button>
                </>
              )}
            </>
          ) : (
            <div className="pp-img-placeholder">이미지 없음</div>
          )}
        </section>

        {/* 기본 정보 */}
        <section className="pp-info">
          {p.priceText && (
            <div className="pp-row">
              <span className="pp-label">가격</span>
              <span className="pp-val pp-price">{p.priceText}</span>
            </div>
          )}
          {p.address && (
            <div className="pp-row">
              <span className="pp-label">주소</span>
              <span className="pp-val">{p.address}</span>
            </div>
          )}
          <div className="pp-grid">
            {p.area && (
              <div className="pp-cell"><span className="pp-k">면적</span><span className="pp-v">{p.area}</span></div>
            )}
            {p.floor && (
              <div className="pp-cell"><span className="pp-k">층</span><span className="pp-v">{p.floor}</span></div>
            )}
            {p.builtYear && (
              <div className="pp-cell"><span className="pp-k">준공</span><span className="pp-v">{p.builtYear}</span></div>
            )}
            {typeof p.safetyScore === 'number' && (
              <div className="pp-cell"><span className="pp-k">안전점수</span><span className="pp-v">{p.safetyScore}점</span></div>
            )}
          </div>

          {!!(p.features?.length) && (
            <div className="pp-chips">
              {p.features.map((f, i) => <span className="pp-chip" key={`${f}-${i}`}>{f}</span>)}
            </div>
          )}
        </section>

        {p.description && (
          <section className="pp-desc">
            {p.description}
          </section>
        )}

        <footer className="pp-actions">
          <button className="pp-btn pp-primary" onClick={onClose}>문의하기</button>
          <button className="pp-btn" onClick={onClose}>관심등록</button>
        </footer>
      </div>
    </Modal>
  );
}
