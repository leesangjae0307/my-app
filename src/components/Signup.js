import React, { useState } from "react";

const Signup = ({ setShowSignup, setCurrentUser, setAppData }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // 알림 메시지 상태

  const signup = () => {
    const data = JSON.parse(localStorage.getItem("appData")) || {
      users: [],
      todos: {},
      currentUser: null,
    };

    if (data.users.find((u) => u.email === email)) {
      setMessage("이미 존재하는 계정입니다.");
      return;
    }

    data.users.push({ email, password });
    data.todos[email] = [];
    data.currentUser = email;

    localStorage.setItem("appData", JSON.stringify(data));
    setAppData(data);
    setCurrentUser(email);

    setMessage("✅ 회원가입 완료!");
    setTimeout(() => {
      setShowSignup(false); // 1~2초 뒤 로그인 화면으로 이동
    }, 1500);
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
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
      <button onClick={signup}>회원가입</button>
      {message && <p style={{ color: "green" }}>{message}</p>}
      <p>
        이미 계정이 있나요?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => setShowSignup(false)}
        >
          로그인
        </span>
      </p>
    </div>
  );
};

export default Signup;
