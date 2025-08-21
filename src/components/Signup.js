import React, { useState } from "react";

const Signup = ({ setShowSignup, setCurrentUser, setAppData }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = () => {
    const data = JSON.parse(localStorage.getItem("appData")) || {
      users: [],
      todos: {},
      currentUser: null,
    };

    // 이미 존재하는 계정 체크
    if (data.users.find((u) => u.email === email)) {
      alert("이미 존재하는 계정입니다.");
      return;
    }

    // 새로운 사용자 추가
    data.users.push({ email, password });
    data.todos[email] = [];
    data.currentUser = email; // 가입 후 자동 로그인

    // localStorage와 App.js 상태 업데이트
    localStorage.setItem("appData", JSON.stringify(data));
    setAppData(data);
    setCurrentUser(email);

    alert("회원가입 완료!");
    setShowSignup(false); // 로그인 화면으로 이동
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
