import React, { useEffect, useMemo, useState } from 'react';
import Modal from './Modal.jsx';
import './PreferenceChooseModal.css';

import {
  REGIONS, AREA_BUCKETS, FLOORS, DIRECTIONS, INFRA_KEYS, DEFAULT_PRICE
} from '../schemas/index.js';

function MultiChipSelect({ label, options = [], value = [], onChange }) {
  const toggle = (val) => {
    const set = new Set(value);
    set.has(val) ? set.delete(val) : set.add(val);
    onChange?.(Array.from(set));
  };

  return (
    <div className="prefm-cell full">
      {label && <label className="prefm-label">{label}</label>}
      <div className="chips">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`chip ${value.includes(opt) ? 'active' : ''}`}
            onClick={() => toggle(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// listing 배열 스키마로 표준화
const EMPTY_LISTING = { area: [], floors: [], directions: [] };
const ensureArray = (v) => (Array.isArray(v) ? v : []);

export default function PreferenceChooseModal({
  category, isOpen, onClose, onSave, initialValues = {}, autoDraftKey,
}) {
  const [values, setValues] = useState(initialValues);

  // 열릴 때 초기값/임시저장 복구
  useEffect(() => {
    if (!isOpen) return;
    let base = {};
    if (Object.keys(initialValues || {}).length) {
base = initialValues;
    } else if (autoDraftKey && category) {
      try {
        const raw = localStorage.getItem(autoDraftKey);
        const all = raw ? JSON.parse(raw) : {};
        base = all[category] || {};
      } catch {
        base = {};
      }
    }
    if (category === 'listing') {
      base = {
        ...EMPTY_LISTING,
        ...base,
        area: ensureArray(base.area),
        floors: ensureArray(base.floors),
        directions: ensureArray(base.directions),
      };
    }
    setValues(base);
  }, [isOpen, category, initialValues, autoDraftKey]);

  // 자동 임시저장
  useEffect(() => {
    if (!autoDraftKey || !category) return;
    try {
      const raw = localStorage.getItem(autoDraftKey);
      const all = raw ? JSON.parse(raw) : {};
      all[category] = values;
      localStorage.setItem(autoDraftKey, JSON.stringify(all));
    } catch {}
  }, [values, category, autoDraftKey]);

  const set = (k, v) => setValues((p) => ({ ...p, [k]: v }));

  const header = useMemo(() => {
    switch (category) {
      case 'region':  return { title: '지역 선호도 설정', sub: '시 → 구/군 → 동을 선택하세요 (선택 안 해도 저장 가능)' };
      case 'price':   return { title: '가격 범위', sub: '보증금 · 월세 범위를 조절하세요 (만원 단위)' };
      case 'infra':   return { title: '인프라 중요도', sub: '항목별 중요도를 별 0~3개로 표시하세요' };
      case 'listing': return { title: '매물 조건', sub: '면적/층수/방향을 다중 선택하세요' };
      case 'safety':  return { title: '안전 선호 (준비 중)', sub: '지금은 저장만 가능합니다' };
      default:        return { title: '', sub: '' };
    }
  }, [category]);

  const clampPair = (a, b, step = 1) => {
    if (a > b) [a, b] = [b, a];
    a = Math.max(0, Math.round(a / step) * step);
    b = Math.max(0, Math.round(b / step) * step);
    return [a, b];
  };

  // Region UI 
  const regionUI = (
    <>
      <div className="prefm-cell full">
        <label className="prefm-label">시/도</label>
        <select
          className="select"
          value={values.city || ''}
          onChange={(e) => {
            const city = e.target.value || undefined;
            setValues((p) => ({ ...p, city, district: undefined, dong: undefined }));
          }}
        >
          <option value="">선택 안 함</option>
          {Object.keys(REGIONS).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="prefm-cell">
        <label className="prefm-label">구/군</label>
        <select
          className="select"
          value={values.district || ''}
          onChange={(e) => set('district', e.target.value || undefined)}
          disabled={!values.city}
        >
          <option value="">선택 안 함</option>
          {values.city && Object.keys(REGIONS[values.city]).map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="prefm-cell">
        <label className="prefm-label">동</label>
        <select
          className="select"
          value={values.dong || ''}
          onChange={(e) => set('dong', e.target.value || undefined)}
          disabled={!values.city || !values.district}
        >
          <option value="">선택 안 함</option>
          {values.city && values.district &&
            REGIONS[values.city][values.district].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))
          }
        </select>
      </div>

      <div className="prefm-cell full">
        <span className="text-muted"> </span>
      </div>
    </>
  );

  // Price UI
  const priceVals = {
    depositMin: values.depositMin ?? DEFAULT_PRICE.depositMin,
    depositMax: values.depositMax ?? DEFAULT_PRICE.depositMax,
    rentMin:    values.rentMin    ?? DEFAULT_PRICE.rentMin,
    rentMax:    values.rentMax    ?? DEFAULT_PRICE.rentMax,
  };

  const priceUI = (
    <>
      {/* 보증금 */}
      <div className="prefm-cell full">
        <label className="prefm-label">보증금 범위 (만원)</label>
        <div className="range">
          <div className="vals">
            <span>최소: {priceVals.depositMin}만</span>
            <span>최대: {priceVals.depositMax}만</span>
          </div>
          <input
            type="range" min="0" max="5000" step="50" value={priceVals.depositMin}
            onChange={(e) => {
              const [min, max] = clampPair(parseInt(e.target.value,10), priceVals.depositMax, 50);
              setValues((p) => ({ ...p, depositMin: min, depositMax: max }));
            }}
          />
          <input
            type="range" min="0" max="5000" step="50" value={priceVals.depositMax}
            onChange={(e) => {
              const [min, max] = clampPair(priceVals.depositMin, parseInt(e.target.value,10), 50);
              setValues((p) => ({ ...p, depositMin: min, depositMax: max }));
            }}
          />
          <div className="row">
            <input
              className="input" type="number" min="0" step="10" value={priceVals.depositMin}
              onChange={(e) => {
                const [min, max] = clampPair(parseInt(e.target.value||0,10), priceVals.depositMax, 10);
                setValues((p) => ({ ...p, depositMin: min, depositMax: max }));
              }}
            />
            <span>~</span>
            <input
              className="input" type="number" min="0" step="10" value={priceVals.depositMax}
              onChange={(e) => {
                const [min, max] = clampPair(priceVals.depositMin, parseInt(e.target.value||0,10), 10);
                setValues((p) => ({ ...p, depositMin: min, depositMax: max }));
              }}
            />
          </div>
        </div>
      </div>

      {/* 월세 */}
      <div className="prefm-cell full">
        <label className="prefm-label">월세 범위 (만원)</label>
        <div className="range">
          <div className="vals">
            <span>최소: {priceVals.rentMin}만</span>
            <span>최대: {priceVals.rentMax}만</span>
          </div>
          <input
            type="range" min="0" max="200" step="5" value={priceVals.rentMin}
            onChange={(e) => {
              const [min, max] = clampPair(parseInt(e.target.value,10), priceVals.rentMax, 5);
              setValues((p) => ({ ...p, rentMin: min, rentMax: max }));
            }}
          />
          <input
            type="range" min="0" max="200" step="5" value={priceVals.rentMax}
            onChange={(e) => {
              const [min, max] = clampPair(priceVals.rentMin, parseInt(e.target.value,10), 5);
              setValues((p) => ({ ...p, rentMin: min, rentMax: max }));
            }}
          />
          <div className="row">
            <input
              className="input" type="number" min="0" step="1" value={priceVals.rentMin}
              onChange={(e) => {
                const [min, max] = clampPair(parseInt(e.target.value||0,10), priceVals.rentMax, 1);
                setValues((p) => ({ ...p, rentMin: min, rentMax: max }));
              }}
            />
            <span>~</span>
            <input
              className="input" type="number" min="0" step="1" value={priceVals.rentMax}
              onChange={(e) => {
                const [min, max] = clampPair(priceVals.rentMin, parseInt(e.target.value||0,10), 1);
                setValues((p) => ({ ...p, rentMin: min, rentMax: max }));
              }}
            />
          </div>
        </div>
      </div>
    </>
  );

  // Infra UI 
  const Stars = ({ value = 0, onChange }) => (
    <div className="stars">
      {[0,1,2,3].map((n) => (
        <button
          key={n}
          type="button"
          className={`star ${value >= n ? 'on' : ''}`}
          onClick={() => onChange(n)}
          aria-label={`${n}점`}
        >
          {n}
        </button>
      ))}
    </div>
  );

  const infraUI = (
    <>
      {INFRA_KEYS.map(({ key, label }) => (
        <div className="prefm-cell" key={key}>
          <label className="prefm-label">{label}</label>
          <Stars value={values[key] ?? 0} onChange={(v) => set(key, v)} />
          <div className="prefm-helper">0(안 중요) ~ 3(매우 중요)</div>
        </div>
      ))}
      <div className="prefm-cell full">
        <span className="text-muted"> </span>
      </div>
    </>
  );

  // Listing UI (면적/층수/방향)
  const listingUI = (
    <>
      <MultiChipSelect
        label="면적 "
        options={AREA_BUCKETS}
        value={values.area || []}
        onChange={(arr) => set('area', arr)}
      />
      <MultiChipSelect
        label="층수 "
        options={FLOORS}
        value={values.floors || []}
        onChange={(arr) => set('floors', arr)}
      />
      <MultiChipSelect
        label="방향 "
        options={DIRECTIONS}
        value={values.directions || []}
        onChange={(arr) => set('directions', arr)}
      />
      
      <div className="prefm-cell full">
        <span className="text-muted"> </span>
      </div>
    </>
  );

  // Safety UI
  const safetyUI = (
    <div className="prefm-cell full">
      <p className="text-muted">안전 선호 입력은 추후 제공 예정입니다. 지금은 저장만 가능합니다 🙂</p>
    </div>
  );

  const bodyByCategory = () => {
    switch (category) {
      case 'region':  return regionUI;
      case 'price':   return priceUI;
      case 'infra':   return infraUI;
      case 'listing': return listingUI;
      case 'safety':  return safetyUI;
      default:        return null;
    }
  };

  const submit = (e) => {
    e?.preventDefault?.();
    onSave?.({ category, values });  
    onClose?.();
  };

  if (!category) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <header className="prefm-header">
        <h3 className="prefm-title">{header.title}</h3>
        {header.sub && <p className="prefm-sub">{header.sub}</p>}
      </header>

      <form className="prefm-form" onSubmit={submit}>
        <div className="prefm-grid" data-variant={category} >
          {bodyByCategory()}
        </div>

        <div className="prefm-actions">
          <button type="button" className="prefm-btn ghost" onClick={onClose}>취소</button>
          <button type="submit" className="prefm-btn primary">확인</button>
        </div>
      </form>
    </Modal>
  );
};