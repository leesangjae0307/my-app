import React, { useState } from "react";
import Signup from "./Signup";

const Login = ({ setCurrentUser, setAppData }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  const login = () => {
    const data = JSON.parse(localStorage.getItem("appData")) || {
      users: [],
      todos: {},
      currentUser: null,
    };

    const user = data.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      data.currentUser = email;
      localStorage.setItem("appData", JSON.stringify(data));
      setCurrentUser(email); // App.js에 현재 사용자 정보 전달
      setAppData(data); // App.js에 전체 데이터 업데이트
    } else {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="auth-container">
      {showSignup ? (
        <Signup setShowSignup={setShowSignup} setAppData={setAppData} />
      ) : (
        <div className="login-form">
          <h2>로그인</h2>
          <input
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={login}>로그인</button>
          <p>
            계정이 없나요?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => setShowSignup(true)}
            >
              회원가입
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
