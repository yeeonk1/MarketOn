import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const handleSearch = () => {
    if (!searchKeyword.trim()) return;
    navigate(`/products/search?keyword=${encodeURIComponent(searchKeyword)}`);
  };

  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("name");
    navigate("/");
    window.location.reload();
  };

  const handleMyPage = () => {
    if (name) {
      navigate("/auth/mypage");
    } else {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/auth/login");
    }
  };

  return (
    <>
      <header className="header-wrapper">
        <section className="logo-sec">
          <div className="title">
            <Link to="/" style={{ textDecoration: "none" }}>
              <h2 className="logo">Market ON</h2>
            </Link>
          </div>
        </section>

        <section className="search-sec">
          <div>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="어떤 품목을 찾으시나요?"
            />
            <button onClick={handleSearch}>검색</button>
          </div>
        </section>

        <section className="user-auth-sec">
          <div className="user-placeholder">
            {name ? (
              <>
                <span className="welcomeMsg">
                  <b>{name}</b>님 환영합니다
                </span>
                <button onClick={handleLogout} className="logout">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="login"
                >
                  로그인
                </button>
                <button onClick={() => navigate("/auth/join")} className="join">
                  회원가입
                </button>
              </>
            )}
          </div>
        </section>
      </header>

      <div className="main-layout">
        <nav className="menu-card">
          <button onClick={() => navigate("/")}>🏠 홈</button>
          <button onClick={() => navigate("/products/analysis")}>
            📊 시세 분석
          </button>
          <button onClick={() => navigate("/products/bargainList")}>
            🟢 추천
          </button>
          <button onClick={handleMyPage}>👤 마이페이지</button>
        </nav>
      </div>
    </>
  );
};

export default Header;
