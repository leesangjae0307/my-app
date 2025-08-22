import React, { useState } from "react";

const Login = ({ setShowSignup, setCurrentUser, setAppData }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    const data = JSON.parse(localStorage.getItem("appData")) || {
      users: [],
      todos: {},
    };
    const user = data.users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) return alert("이메일 또는 비밀번호가 잘못되었습니다.");
    data.currentUser = email;
    localStorage.setItem("appData", JSON.stringify(data));
    setAppData(data);
    setCurrentUser(email);
  };

  return (
    <div className="login-container">
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
  );
};

export default Login;
