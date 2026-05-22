import { useLocation, useNavigate } from "react-router-dom";
import "../css/JoinSuccess.css";

const Joinsuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const name = location.state?.name || "회원";

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">
          <span className="greeting">{name}님, 가입을 환영합니다!</span>
        </h2>
        <p className="explain">
          이제부터 플랫폼의 모든 서비스를
          <br />
          자유롭게 이용하실 수 있습니다.
        </p>
        <button className="go-to-login" onClick={() => navigate("/auth/login")}>
          로그인 하러가기
        </button>
      </div>
    </div>
  );
};

export default Joinsuccess;
