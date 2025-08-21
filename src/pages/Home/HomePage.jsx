import React, { useState } from 'react';
import './Homepage.css';
import PreferenceModal from '../../components/PreferenceChooseModal.jsx'
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { key: 'region',  label: '지역',   sub: '호선 / 지역 선택' },
  { key: 'price',   label: '가격',   sub: '보증금 · 월세 범위' },
  { key: 'infra',   label: '인프라', sub: '생활편의 중요도' },
  { key: 'listing', label: '매물',   sub: '면적 · 층 · 옵션' },
  { key: 'safety',  label: '안전',   sub: 'CCTV · 가로등' },
];

// 저장 키
const FINAL_KEY = 'prefFinal_v1';    // 모달 자동 임시저장
const DRAFT_KEY = 'prefDraft';       // 최종 저장(덮어쓰기)

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  // 카테고리별 최신 값
  const [saved, setSaved] = useState({
    region: {}, price: {}, infra: {}, listing: {}, safety: {}
  });
  
  const navigate = useNavigate();

  const handleClick = (key) => {
    setActiveCategory(key);
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);
  
  // 모달 '저장' → 메모리(saved)에 반영
  const handleSave = ({ category, values }) => {
    setSaved((prev) => ({ ...prev, [category]: values || {} })); // 빈 값도 저장 OK
    setIsOpen(false);
  };

  // "선호도 저장" 버튼: 임시저장 + 메모리 병합 후 최종 저장 -> 메인 페이지 이동
  const handleSaveAll = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      const draft = raw ? JSON.parse(raw) : {};

      // draft → saved 순으로 병합하면, 최근에 모달에서 저장한 값이 우선
      const finalPayload = {
        region: {}, price: {}, infra: {}, listing: {}, safety: {}, 
        ...draft, ...saved,
      };
      // 최종 저장
      localStorage.setItem(FINAL_KEY, JSON.stringify(finalPayload));

      // 임시 저장 삭제
      localStorage.removeItem(DRAFT_KEY);

      // 메인 페이지로 이동
      navigate('/main', { replace: true, state: { prefUpdated: true } });
    } catch (e) {
      console.error(e);
      alert('선호도 저장 중 오류가 발생했습니다.');
    }
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
            aria-label={`${label} 선호도 설정`}
          >
            <span className={`icon ${key}`} aria-hidden />
            <div className="meta">
              <span className="label">{label}</span>
              <span className="sub">{sub}</span>
            </div>
          </button>
        ))}
      </section>

      <div className="home-actions">
        <button type="button" className="save-btn" onClick={handleSaveAll}>
          선호도 저장하고 매물 보기
        </button>
      </div>

      {/* 모달 */}
      {activeCategory && (
        <PreferenceModal
          category={activeCategory} 
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
