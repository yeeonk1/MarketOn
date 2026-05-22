import { useState } from "react";
import { Link } from "react-router-dom";
import { userAPI } from "../api/Api";
import "../css/Login.css";

const Login = () => {
  const [loginData, setLoginData] = useState({ id: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await userAPI.login(loginData);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("userRegion", res.data.userRegion);
      console.log("저장된 지역: ", localStorage.getItem("userRegion"));
      window.location.href = "/";
    } catch (error) {
      alert("아이디 또는 비밀번호를 확인해 주세요.");
    }
  };

  return (
    <div className="container">
      <div className="loginCard">
        <form onSubmit={handleLogin}>
          <h2 className="title">로그인</h2>
          <input
            name="id"
            placeholder="아이디를 입력하세요."
            onChange={(e) => setLoginData({ ...loginData, id: e.target.value })}
            required
          />
          <input
            name="password"
            placeholder="비밀번호를 입력하세요."
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
            type="password"
          />
          <button type="submit" className="goLogin">
            로그인
          </button>
        </form>
      </div>
      <div className="forJoin">
        <small>
          아직 계정이 없으신가요?
          <Link to="/auth/join" className="goJoin">
            회원가입 하러가기
          </Link>
        </small>
      </div>
    </div>
  );
};

export default Login;
