import { useNavigate, NavLink } from 'react-router-dom';
import { useState } from 'react';
import logoImg from '../assets/logo.png'; 
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
  e.preventDefault();
  const keyword = searchInput.trim();
  if (!keyword) return;

  navigate(`/main?keyword=${encodeURIComponent(keyword)}`);
  setSearchInput(""); 
};   

  return (
    <header className="header-container">
        <NavLink to="/" className="header-logo">
            <img src={logoImg} alt="SafeHome 로고" className="logo-image" />
        </NavLink>

        <form className="header-search" onSubmit={handleSearch}>
            <input 
                type="text"
                placeholder="지역 또는 매물명을 검색하세요"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="search-input"
            />
            <button type="submit" className="search-button">검색</button>
        </form>

        <nav className="header-nav">
            <NavLink to="/main" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>지도</NavLink>
            <NavLink to="/mypage" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>마이페이지</NavLink>
            <NavLink to="/login" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>로그인</NavLink>
            <NavLink to="/signup" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>회원가입</NavLink>
        </nav>

    </header>
  );
};

export default Header;