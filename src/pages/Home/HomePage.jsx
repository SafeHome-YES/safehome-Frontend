// src/pages/Home/HomePage.jsx
import React, { useState } from 'react';
import './Homepage.css';
import PreferenceModal from '../../components/PreferenceChooseModal.jsx';

const CATEGORIES = [
  { key: 'region',  label: '지역',   sub: '호선 / 지역 선택' },
  { key: 'price',   label: '가격',   sub: '보증금 · 월세 범위' },
  { key: 'infra',   label: '인프라', sub: '생활편의 중요도' },
  { key: 'listing', label: '매물',   sub: '면적 · 층 · 옵션' },
  { key: 'safety',  label: '안전',   sub: 'CCTV · 가로등' },
];


export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [saved, setSaved] = useState({}); // 저장된 값(선택)

  const handleClick = (key) => {
    setActiveCategory(key);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = ({ category, values }) => {
    // 카테고리별 저장값을 기억하고 싶다면 이렇게 보관
    setSaved((prev) => ({ ...prev, [category]: values }));
    // 저장 이후 모달 닫힘
    setIsOpen(false);
    console.log('[HomePage] onSave:', category, values);
  };

  return (
    <div className="home-wrap">
      <header className="home-hero" style={{ textAlign: 'center' }}>
        <h1 className="home-title">어떤 조건을 우선으로 볼까요?</h1>
        <p className="home-sub">선호도 입력을 시작하세요</p>
      </header>

      <section className="category-grid">
        {CATEGORIES.map(({ key, label, sub }) => (
          <button
            key={key}
            type="button"
            className="category-card"
            onClick={() => handleClick(key)}
          >
            <span className={`icon ${key}`} aria-hidden />
            <div className="meta">
              <span className="label">{label}</span>
              <span className="sub">{sub}</span>
            </div>
          </button>
        ))}
      </section>

      {/* 모달: 카테고리를 선택했을 때만 렌더 */}
      {activeCategory && (
        <PreferenceModal
          category={activeCategory}     // 클릭된 카테고리 키 (region/price/infra/listing/safety)
          isOpen={isOpen}
          onClose={handleClose}
          onSave={handleSave}
          initialValues={saved[activeCategory] || {}}  // 이전에 저장한 값이 있으면 기본값으로
          autoDraftKey="prefDraft"      // 로컬스토리지 자동 임시저장 키
        />
      )}
    </div>
  );
}
