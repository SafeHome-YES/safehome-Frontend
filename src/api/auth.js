/* 실제 코드 
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

// 아이디 중복 체크
export const checkUsername = async (userID) => {
  const res = await axios.post(`${API}/auth/check-username`, { userID });
  return res.data; // { available: true/false }
};

// 회원가입
export const signup = async (payload) => {
  const res = await axios.post(`${API}/auth/signup`, payload);
  return res.data;
};
*/

// Mock API 구현
// 실제 axios 불러오기 대신 setTimeout으로 가짜 응답 반환
export const checkUsername = async (userID) => {
  console.log('[MOCK] checkUsername 호출됨:', userID);
  return new Promise((resolve) => {
    setTimeout(() => {
      // 데모: "admin", "test"는 불가, 나머지는 가능
      const unavailable = ['admin', 'test'];
      const available = !unavailable.includes(userID.toLowerCase());
      resolve({ available });
    }, 500);
  });
};

export const signup = async (payload) => {
  console.log('[MOCK] signup 호출됨:', payload);
  return new Promise((resolve) => {
    setTimeout(() => {
      // 성공 응답
      resolve({ success: true, message: '회원가입 성공' });
    }, 800);
  });
};

// 로그인 (MOCK)
export const login = async ({ userID, password }) => {
  console.log("[MOCK] login:", userID, password);
  return new Promise((resolve) => {
    setTimeout(() => {
      // 데모 규칙: userID: demo / password: 1234abcd! 이면 성공
      if (userID === "demo" && password === "1234abcd!") {
        resolve({ success: true, user: { id: 1, userID: "demo", name: "데모유저" } });
      } else {
        resolve({ success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." });
      }
    }, 600);
  });
};