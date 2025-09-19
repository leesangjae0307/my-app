import React, { useState } from "react";
import { useAppContext, ActionTypes } from "../context/AppContext";

const Signup = ({ setShowSignup }) => {
  const { state, dispatch } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = () => {
    if (state.users.find((u) => u.email === email)) {
      return alert("이미 존재하는 계정입니다.");
    }

    const newUsers = [...state.users, { email, password }];
    const newTodos = { ...state.todos, [email]: [] };

    dispatch({ type: ActionTypes.UPDATE_USERS, payload: newUsers });
    dispatch({ type: ActionTypes.UPDATE_TODOS, payload: newTodos });
    dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: email });

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
