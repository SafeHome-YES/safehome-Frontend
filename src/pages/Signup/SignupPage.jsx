import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, checkUsername } from '../../api/auth';
import './SignupPage.css';

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userID: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    emailLocal: '',
    emailDomain: 'naver.com',
    emailDomainCustom: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  const [errors, setErrors] = useState({});
  const [dupCheck, setDupCheck] = useState({ checked: false, message: '' });
  const [submitting, setSubmitting] = useState(false);

  // 입력값 변경
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'userID') setDupCheck({ checked: false, message: '' });
  };

  // 체크박스 변경
  const onChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // 아이디 중복확인
  const checkDuplicateID = async () => {
    const id = formData.userID.trim();
    if (!id || id.length < 4 || id.length > 20) {
      setDupCheck({ checked: false, message: '아이디는 4~20자로 입력하세요.' });
      return;
    }
    try {
      const res = await checkUsername(id);
      if (res.available) {
        setDupCheck({ checked: true, message: '사용 가능한 아이디입니다.' });
      } else {
        setDupCheck({ checked: false, message: '이미 사용 중인 아이디입니다.' });
      }
    } catch {
      setDupCheck({ checked: false, message: '중복 확인 중 오류가 발생했습니다.' });
    }
  };

  // 유효성 검사
  const passwordOk = (pw) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|\\:;"'<>,.?/]).{8,20}$/.test(pw);
  const phoneOk = (p) => /^\d{11}$/.test(p.replace(/-/g, ''));

  const buildEmail = () => {
    const domain =
      formData.emailDomain === 'custom'
        ? formData.emailDomainCustom.trim()
        : formData.emailDomain;
    return `${formData.emailLocal.trim()}@${domain}`.toLowerCase();
  };

  const validate = () => {
    const next = {};
    if (!formData.userID.trim()) next.userID = '아이디를 입력하세요.';
    else if (formData.userID.length < 4 || formData.userID.length > 20)
      next.userID = '아이디는 4~20자여야 합니다.';
    else if (!dupCheck.checked) next.userID = '아이디 중복 확인을 하세요.';

    if (!formData.password) next.password = '비밀번호를 입력하세요.';
    else if (!passwordOk(formData.password))
      next.password = '문자/숫자/특수문자 포함 8~20자로 입력하세요.';

    if (!formData.confirmPassword) next.confirmPassword = '비밀번호 확인을 입력하세요.';
    else if (formData.password !== formData.confirmPassword)
      next.confirmPassword = '비밀번호가 일치하지 않습니다.';

    if (!formData.name.trim()) next.name = '이름을 입력하세요.';
    if (!formData.phone.trim()) next.phone = '휴대폰 번호를 입력하세요.';
    else if (!phoneOk(formData.phone)) next.phone = '형식이 올바르지 않습니다.';

    if (!formData.emailLocal.trim()) next.emailLocal = '이메일 아이디를 입력하세요.';
    if (formData.emailDomain === 'custom' && !formData.emailDomainCustom.trim())
      next.emailDomainCustom = '도메인을 입력하세요.';

    if (!formData.agreeTerms) next.agreeTerms = '이용약관 동의 필수';
    if (!formData.agreePrivacy) next.agreePrivacy = '개인정보 동의 필수';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        userID: formData.userID.trim(),
        password: formData.password,
        name: formData.name.trim(),
        phone: formData.phone.replace(/-/g, ''),
        email: buildEmail(),
        agree: {
          terms: formData.agreeTerms,
          privacy: formData.agreePrivacy,
          marketing: formData.agreeMarketing,
        },
      };
      await signup(payload);
      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch {
      setErrors({ api: '회원가입 중 오류가 발생했습니다.' });
    } finally {
      setSubmitting(false);
    }
  };

  const domainIsCustom = formData.emailDomain === 'custom';

  return (
    <div className="signup-grid">
      {/* 왼쪽: 폼 */}
      <div className="signup-card">
        <h1 className="title">회원 가입</h1>
        <p className="subtitle">
          이미 계정이 있나요?{' '}
          <button type="button" className="linklike" onClick={() => navigate('/login')}>
            로그인
          </button>
        </p>

        {errors.api && <div className="error api-error">{errors.api}</div>}

        <form className="form" onSubmit={handleSubmit} noValidate>
          {/* 아이디 + 중복 확인 */}
          <div className="form-row">
            <label className="label">아이디</label>
            <div className="id-inline">
              <input
                name="userID"
                value={formData.userID}
                onChange={onChange}
                placeholder="아이디 입력 (4~20자)"
                className={`input ${errors.userID ? 'invalid' : ''}`}
                maxLength={20}
              />
              <button type="button" className="btn secondary" onClick={checkDuplicateID}>
                중복 확인
              </button>
            </div>
            <div
              className={`help ${
                dupCheck.message ? (dupCheck.checked ? 'ok' : 'invalid') : ''
              }`}
            >
              {dupCheck.message || errors.userID || ''}
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="form-row">
            <label className="label">비밀번호</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={onChange}
              placeholder="문자/숫자/특수문자 포함 8~20자"
              className={`input ${errors.password ? 'invalid' : ''}`}
              autoComplete="new-password"
            />
            {errors.password && <div className="help invalid">{errors.password}</div>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-row">
            <label className="label">비밀번호 확인</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={onChange}
              placeholder="비밀번호 재입력"
              className={`input ${errors.confirmPassword ? 'invalid' : ''}`}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <div className="help invalid">{errors.confirmPassword}</div>
            )}
          </div>

          {/* 이름 */}
          <div className="form-row">
            <label className="label">이름</label>
            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="이름을 입력하세요"
              className={`input ${errors.name ? 'invalid' : ''}`}
            />
            {errors.name && <div className="help invalid">{errors.name}</div>}
          </div>

          {/* 전화번호 */}
          <div className="form-row">
            <label className="label">전화번호</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="휴대폰 번호 입력('-' 제외 11자리)"
              className={`input ${errors.phone ? 'invalid' : ''}`}
              inputMode="numeric"
              maxLength={11}
            />
            {errors.phone && <div className="help invalid">{errors.phone}</div>}
          </div>

          {/* 이메일 */}
          <div className="form-row">
            <label className="label">이메일 주소</label>
            <div className="email-inline">
              <input
                name="emailLocal"
                value={formData.emailLocal}
                onChange={onChange}
                placeholder="이메일 주소"
                className={`input ${errors.emailLocal ? 'invalid' : ''}`}
              />
              <span className="at">@</span>
              <select
                name="emailDomain"
                value={formData.emailDomain}
                onChange={onChange}
                className="select"
              >
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
                <option value="custom">직접 입력</option>
              </select>
            </div>
            {domainIsCustom && (
              <input
                name="emailDomainCustom"
                value={formData.emailDomainCustom}
                onChange={onChange}
                placeholder="예: example.com"
                className={`input mt8 ${errors.emailDomainCustom ? 'invalid' : ''}`}
              />
            )}
            {(errors.emailLocal || errors.emailDomainCustom) && (
              <div className="help invalid">
                {errors.emailLocal || errors.emailDomainCustom}
              </div>
            )}
          </div>

          {/* 약관 동의 */}
          <div className="form-row agree-box">
            <label className="label">약관 동의</label>
            <label className="checkbox">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={onChangeCheckbox}
              />
              이용약관 동의 (필수)
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={onChangeCheckbox}
              />
              개인정보 수집 및 이용 동의 (필수)
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                name="agreeMarketing"
                checked={formData.agreeMarketing}
                onChange={onChangeCheckbox}
              />
              이벤트 등 이메일 수신 동의 (선택)
            </label>
            {(errors.agreeTerms || errors.agreePrivacy) && (
              <div className="help invalid">
                {errors.agreeTerms || errors.agreePrivacy}
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <button type="submit" className="btn primary full" disabled={submitting}>
            {submitting ? '처리 중...' : '회원 가입'}
          </button>
        </form>
      </div>

      {/* 오른쪽: 소셜 가입 */}
      <aside className="social-card">
        <button className="btn social fb">Facebook 계정으로 가입</button>
        <button className="btn social kakao">카카오 계정으로 가입</button>
        <button className="btn social naver">네이버 계정으로 가입</button>
        <button className="btn social google">Google 계정으로 가입</button>
      </aside>
    </div>
  );
}