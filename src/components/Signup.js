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

    // 이미 존재하는 계정 체크
    if (data.users.find((u) => u.email === email)) {
      setMessage("이미 존재하는 계정입니다.");
      return;
    }

    // 새로운 사용자 추가
    data.users.push({ email, password });
    data.todos[email] = [];
    data.currentUser = email;

    // localStorage와 App.js 상태 업데이트
    localStorage.setItem("appData", JSON.stringify(data));
    setAppData(data);
    setCurrentUser(email);

    // 메시지 먼저 띄우기
    setMessage("✅ 회원가입 완료!");

    // 1초 후 로그인 화면으로 이동
    setTimeout(() => {
      setShowSignup(false);
      setMessage(""); // 메시지 초기화
    }, 1000);
  };

  return (
    <div className="signup-container" style={{ position: "relative" }}>
      {/* 상단 메시지 */}
      {message && (
        <div
          style={{
            position: "absolute",
            top: "-40px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: message.includes("완료") ? "green" : "red",
            color: "white",
            fontWeight: "bold",
            padding: "8px 16px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            zIndex: 100,
          }}
        >
          {message}
        </div>
      )}

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
