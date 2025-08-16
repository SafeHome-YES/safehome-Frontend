import React from 'react';

export function TextInput({ id, value = '', onChange, ...rest }) {
  return (
    <input
      id={id}
      type="text"
      className="prefm-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}

export function NumberInput({ id, value = 0, onChange, ...rest }) {
  return (
    <input
      id={id}
      type="number"
      className="prefm-input"
      value={value}
      onChange={(e) => {
        const n = e.target.valueAsNumber;
        onChange(Number.isFinite(n) ? n : 0);
      }}
      {...rest}
    />
  );
}

export function Checkbox({ id, value = false, onChange, ...rest }) {
  return (
    <input
      id={id}
      type="checkbox"
      checked={!!value}
      onChange={(e) => onChange(e.target.checked)}
      {...rest}
    />
  );
}

export function Select({ id, value = '', onChange, options = [], ...rest }) {
  return (
    <select
      id={id}
      className="prefm-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    >
      {options.map((opt) => {
        const v = opt.value ?? opt;
        const label = opt.label ?? String(opt);
        return (
          <option key={v} value={v}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

export function Slider({
  id,
  value = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  ...rest
}) {
  return (
    <input
      id={id}
      type="range"
      className="prefm-slider"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      {...rest}
    />
  );
}

export function RangeSlider({
  id,
  value = [0, 100],
  onChange,
  min = 0,
  max = 100,
  step = 1,
}) {
  const [a, b] = Array.isArray(value) ? value : [min, max];
  const setA = (nv) => onChange([nv, Math.max(b, nv)]);
  const setB = (nv) => onChange([Math.min(a, nv), nv]);

  return (
    <div id={id} className="prefm-range">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={a}
        onChange={(e) => setA(Number(e.target.value))}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={b}
        onChange={(e) => setB(Number(e.target.value))}
      />
      <div className="prefm-range-values">
        {a} ~ {b}
      </div>
    </div>
  );
}

export function ChipsMulti({ id, value = [], onChange, options = [] }) {
  const sel = new Set(value || []);
  const toggle = (v) => {
    const s = new Set(sel);
    s.has(v) ? s.delete(v) : s.add(v);
    onChange(Array.from(s));
  };

  return (
    <div id={id} className="prefm-chips">
      {options.map((opt) => {
        const v = opt.value ?? opt;
        const label = opt.label ?? String(opt);
        const active = sel.has(v);
        return (
          <button
            type="button"
            key={v}
            className={`prefm-chip ${active ? 'active' : ''}`}
            onClick={() => toggle(v)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function Rating({ id, value = 3, onChange, min = 1, max = 5 }) {
  const items = [];
  for (let i = min; i <= max; i++) {
    items.push(
      <button
        type="button"
        key={i}
        aria-label={`${i}점`}
        className={`prefm-star ${i <= value ? 'on' : ''}`}
        onClick={() => onChange(i)}
      >
        ★
      </button>
    );
  }
  return (
    <div id={id} className="prefm-rating">
      {items}
    </div>
  );
}
