import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userID: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const next = {};
    if (!form.userID.trim()) next.userID = "아이디를 입력하세요.";
    if (!form.password) next.password = "비밀번호를 입력하세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      // 목업/실제 API 공통 인터페이스
      const res = await login({ userID: form.userID.trim(), password: form.password });
      if (res?.success) {
        // TODO: AuthContext가 있다면 여기서 setUser/token 저장
        alert("로그인 성공!");
        navigate("/main");
      } else {
        setApiError(res?.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      setApiError("로그인 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="title">로그인</h1>

        {apiError && <div className="error api-error">{apiError}</div>}

        <div className="form-row">
          <label htmlFor="userID">아이디</label>
          <input
            id="userID"
            name="userID"
            value={form.userID}
            onChange={onChange}
            placeholder="아이디를 입력하세요"
            className={errors.userID ? "invalid" : ""}
            autoComplete="username"
          />
          {errors.userID && <div className="help invalid">{errors.userID}</div>}
        </div>

        <div className="form-row">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="비밀번호"
            className={errors.password ? "invalid" : ""}
            autoComplete="current-password"
          />
          {errors.password && <div className="help invalid">{errors.password}</div>}
        </div>

        <div className="form-row horizontal">
          <label className="checkbox">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={onChange}
            />
            로그인 상태 유지
          </label>
          <button
            type="button"
            className="linklike"
            onClick={() => alert("비밀번호 찾기(준비 중)")}
          >
            비밀번호 찾기
          </button>
        </div>

        <button type="submit" className="btn primary full" disabled={submitting}>
          {submitting ? "처리 중..." : "로그인"}
        </button>

        <p className="helper">
          계정이 없나요?{" "}
          <button type="button" className="linklike" onClick={() => navigate("/signup")}>
            회원가입
          </button>
        </p>
      </form>
    </div>
  );
}
