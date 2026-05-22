import React, { useEffect, useState } from "react";
import { REGIONS, type UserJoinDTO } from "../types/DTO";
import { userAPI } from "../api/Api";
import { Link, useNavigate } from "react-router-dom";
import "../css/Join.css";

const Join = () => {
  const [formData, setFormData] = useState<
    UserJoinDTO & { passwordConfirm: string }
  >({
    id: "",
    password: "",
    passwordConfirm: "",
    name: "",
    email: "",
    userRegion: "서울",
  });

  const navigate = useNavigate();

  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (e.target.name === "id") {
      setIsIdChecked(false);
    }
    if (e.target.name === "email") {
      setIsEmailChecked(false);
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIdCheck = async () => {
    if (!formData.id) {
      return alert("아이디를 입력하세요.");
    }

    try {
      const isDuplicate = await userAPI.checkId(formData.id);
      if (isDuplicate === true) {
        alert("이미 사용 중인 아이디입니다.");
      } else {
        alert("사용 가능한 아이디입니다.");
        setIsIdChecked(true);
      }
    } catch (error) {
      alert("중복 체크 실패");
    }
  };

  const [emailMessage, setEmailMessage] = useState("");
  const [emailMessageType, setEmailMessageType] = useState<"error" | "success">(
    "error",
  );

  const handleEmailCheck = async () => {
    if (!formData.email) {
      setEmailMessage("");
      setIsEmailChecked(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailMessage("유효한 이메일 형식이 아닙니다.");
      setEmailMessageType("error");
      return;
    }

    try {
      const isDuplicate = await userAPI.checkEmail(formData.email);
      if (isDuplicate) {
        setEmailMessage("이미 가입한 이메일입니다.");
        setEmailMessageType("error");
        setIsEmailChecked(false);
      } else {
        setEmailMessage("사용 가능한 이메일입니다.");
        setEmailMessageType("success");
        setIsEmailChecked(true);
      }
    } catch (error) {
      setEmailMessage("이메일 중복 체크 중 오류가 발생했습니다.");
      setEmailMessageType("error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const idRegEx = /^[a-zA-Z0-9]*$/;
    const pwRegEx = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

    if (!idRegEx.test(formData.id)) {
      alert("아이디는 영문과 숫자만 가능합니다.");
      return;
    }

    if (!pwRegEx.test(formData.password)) {
      alert("비밀번호는 8자 이상의 영문, 숫자, 특수문자 조합이어야 합니다.");
      return;
    }

    if (!isIdChecked) {
      return alert("아이디 중복 확인이 필요합니다.");
    }

    if (formData.email && !isEmailChecked) {
      return alert("입력하신 이메일의 중복 확인이 필요합니다.");
    }

    if (formData.password !== formData.passwordConfirm) {
      return alert("비밀번호 다릅니다.");
    }

    try {
      const { passwordConfirm, ...submitData } = formData;
      await userAPI.join(submitData);
      navigate("/auth/joinSuccess", { state: { name: formData.name } });
    } catch (error: any) {
      alert(error.response?.data || "가입 실패");
    }
  };

  const [passwordMessage, setPasswordMessage] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  useEffect(() => {
    if (!formData.password || !formData.passwordConfirm) {
      setPasswordMessage("");
      setIsPasswordMatch(false);
      return;
    }

    if (formData.password === formData.passwordConfirm) {
      setPasswordMessage("비밀번호가 일치합니다.");
      setIsPasswordMatch(true);
    } else {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
      setIsPasswordMatch(false);
    }
  }, [formData.password, formData.passwordConfirm]);

  return (
    <div className="container">
      <div className="joinCard">
        <h2 className="title">회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              name="id"
              placeholder="아이디를 입력하세요."
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handleIdCheck}>
              중복확인
            </button>
          </div>
          <input
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요."
            onChange={handleChange}
            required
          />
          <input
            name="passwordConfirm"
            type="password"
            placeholder="비밀번호 확인"
            onChange={handleChange}
            required
          />
          {passwordMessage && (
            <p style={{ color: isPasswordMatch ? "blue" : "red" }}>
              {passwordMessage}
            </p>
          )}
          <input
            name="name"
            placeholder="이름를 입력하세요."
            onChange={handleChange}
            required
          />
          <div>
            <input
              name="email"
              type="email"
              placeholder="이메일 주소를 입력하세요."
              onChange={handleChange}
            />
            <button type="button" onClick={handleEmailCheck}>
              중복확인
            </button>

            {emailMessage && (
              <p
                style={{
                  color: emailMessageType === "error" ? "red" : "blue",
                }}
              >
                {emailMessage}
              </p>
            )}
          </div>

          <select
            name="userRegion"
            value={formData.userRegion}
            onChange={handleChange}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button type="submit" disabled={!isIdChecked}>
            가입하기
          </button>
        </form>
      </div>
      <div className="forLogin">
        <small>
          이미 계정이 있으신가요?
          <Link to="/auth/login" className="goLogin">
            로그인 하러가기
          </Link>
        </small>
      </div>
    </div>
  );
};

export default Join;
