// src/components/PreferenceModal/PreferenceModal.jsx
import React, { useMemo, useState, useEffect } from 'react';
import Modal from './Modal.jsx';
import './PreferenceChooseModal.css';
import { SCHEMAS } from '../schemas';
import {TextInput, NumberInput, Checkbox, Select, Slider, ChipsMulti, RangeSlider, Rating} from './fields.jsx';
// 필드 렌더러

const RENDERERS = { text: TextInput, number: NumberInput, checkbox: Checkbox, select: Select, slider: Slider, chips: ChipsMulti, range: Rating};

export default function PreferenceModal({ category, isOpen, onClose, onSave, initialValues = {}, autoDraftKey }) {
  const schema = useMemo(() => (category ? SCHEMAS[category] : null), [category]);
  const [values, setValues] = useState(initialValues || {});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    // 초기값 or 로컬 드래프트
    if (initialValues && Object.keys(initialValues).length) setValues(initialValues);
    else if (autoDraftKey && category) {
      try {
        const raw = localStorage.getItem(autoDraftKey);
        const all = raw ? JSON.parse(raw) : {};
        if (all[category]) setValues(all[category]);
        else setValues({});
      } catch { setValues({}); }
    } else setValues({});
  }, [isOpen, category, initialValues, autoDraftKey]);

  useEffect(() => {
    if (!autoDraftKey || !category) return;
    try {
      const raw = localStorage.getItem(autoDraftKey);
      const all = raw ? JSON.parse(raw) : {};
      all[category] = values;
      localStorage.setItem(autoDraftKey, JSON.stringify(all));
    } catch {}
  }, [values, autoDraftKey, category]);

  const handleChange = (name, v) => setValues((prev) => ({ ...prev, [name]: v }));

  const submit = (e) => {
    e?.preventDefault?.();
    setError('');
    if (schema?.validate) {
      const msg = schema.validate(values);
      if (msg) { setError(msg); return; }
    }
    onSave?.({ category, values });
    onClose?.();
  };

  if (!schema) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="prefm-modal" role="dialog" aria-modal="true" aria-label={schema.title}>
        <header className="prefm-header">
          <h3 className="prefm-title">{schema.title}</h3>
          {schema.subtitle && <p className="prefm-sub">{schema.subtitle}</p>}
        </header>

        <form className="prefm-form" onSubmit={submit}>
          <div className="prefm-grid">
            {schema.fields.map((f) => {
              const Comp = RENDERERS[f.type];
              if (!Comp) return null;
              const id = `f-${category}-${f.name}`;
              const val = values[f.name] ?? f.default ?? (f.type === 'checkbox' ? false : '');
              return (
                <div key={f.name} className={`prefm-cell ${f.fullWidth ? 'full' : ''}`}>
                  {f.label && <label htmlFor={id} className="prefm-label">{f.label}</label>}
                  <Comp id={id} value={val} onChange={(v) => handleChange(f.name, v)} {...(f.props||{})} />
                  {f.helper && <div className="prefm-helper">{f.helper}</div>}
                </div>
              );
            })}
          </div>

          {error && <p className="prefm-error" role="alert">{error}</p>}

          <div className="prefm-actions">
            <button type="button" className="prefm-btn ghost" onClick={onClose}>취소</button>
            <button type="submit" className="prefm-btn primary">저장</button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
