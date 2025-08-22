import React, { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Signup from "./components/Signup";
import Login from "./components/Login";
import CalendarView from "./components/CalendarView";
import "./App.css";

export default function App() {
  const [appData, setAppData] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("appData")) || {
        users: [],
        todos: {},
        currentUser: null,
      }
    );
  });

  const [currentUser, setCurrentUser] = useState(appData.currentUser);
  const [showSignup, setShowSignup] = useState(false); // 회원가입 화면 상태
  const [originalAdmin, setOriginalAdmin] = useState(null);
  const [todos, setTodos] = useState(
    currentUser ? appData.todos[currentUser] || [] : []
  );
  const [hideCompleted, setHideCompleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);

  const isAdmin = currentUser === "admin";

  useEffect(() => {
    if (currentUser) setTodos(appData.todos[currentUser] || []);
  }, [currentUser, appData]);

  useEffect(() => {
    if (!currentUser) return;
    const newAppData = {
      ...appData,
      todos: { ...appData.todos, [currentUser]: todos },
    };
    setAppData(newAppData);
    localStorage.setItem("appData", JSON.stringify(newAppData));
  }, [todos, appData, currentUser]);

  const addTodo = (text, dueDate, category) => {
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text,
        dueDate,
        category: category || "일반",
        completed: false,
      },
    ]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) =>
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

  const filteredTodos = todos.filter((todo) => {
    if (hideCompleted && todo.completed) return false;
    if (categoryFilter !== "All" && todo.category !== categoryFilter)
      return false;
    if (
      searchTerm &&
      !todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort(
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
  );

  const todosToShow = selectedDate
    ? sortedTodos.filter((t) => t.dueDate.slice(0, 10) === selectedDate)
    : sortedTodos;

  const categories = [
    "All",
    ...Array.from(new Set(todos.map((todo) => todo.category))),
  ];

  const BASE_COLORS = ["#ffd6d6", "#d6f0ff", "#d6ffd8", "#fff6d6", "#f0d6ff"];
  const categoryColorMap = {};
  categories.forEach(
    (cat, i) => (categoryColorMap[cat] = BASE_COLORS[i % BASE_COLORS.length])
  );

  const logout = () => {
    const newAppData = { ...appData, currentUser: null };
    setAppData(newAppData);
    setCurrentUser(null);
    setOriginalAdmin(null);
    localStorage.setItem("appData", JSON.stringify(newAppData));
  };

  const deleteUser = (email) => {
    if (!isAdmin && currentUser !== originalAdmin)
      return alert("관리자만 삭제 가능합니다.");
    const newUsers = appData.users.filter((u) => u.email !== email);
    const newTodos = { ...appData.todos };
    delete newTodos[email];
    const newAppData = { ...appData, users: newUsers, todos: newTodos };
    setAppData(newAppData);
    localStorage.setItem("appData", JSON.stringify(newAppData));
    if (currentUser === email) setCurrentUser(originalAdmin || null);
  };

  const viewUserTodos = (email) => {
    if (!isAdmin) return;
    if (!originalAdmin) setOriginalAdmin(currentUser);
    setCurrentUser(email);
    setSelectedDate(null);
  };

  const returnAdmin = () => {
    if (originalAdmin) {
      setCurrentUser(originalAdmin);
      setOriginalAdmin(null);
      setSelectedDate(null);
    }
  };

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
  };

  return (
    <div className="app-container">
      {!currentUser ? (
        showSignup ? (
          <Signup
            setShowSignup={setShowSignup}
            setCurrentUser={setCurrentUser}
            setAppData={setAppData}
          />
        ) : (
          <Login
            setShowSignup={setShowSignup}
            setCurrentUser={setCurrentUser}
            setAppData={setAppData}
          />
        )
      ) : (
        <>
          <h1>📋 {currentUser}'s To-Do List</h1>
          <button onClick={logout} style={{ marginBottom: "10px" }}>
            로그아웃
          </button>

          {isAdmin && !originalAdmin && (
            <div className="admin-panel">
              <h2>관리자: 사용자 리스트</h2>
              {appData.users.map((user) => (
                <div
                  key={user.email}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <span>{user.email}</span>
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => viewUserTodos(user.email)}
                  >
                    보기
                  </button>
                  <button
                    style={{ marginLeft: "5px" }}
                    onClick={() => deleteUser(user.email)}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}

          {originalAdmin && (
            <div>
              <button onClick={returnAdmin} style={{ marginBottom: "10px" }}>
                관리자 계정으로 돌아가기
              </button>
            </div>
          )}

          <TodoForm addTodo={addTodo} />

          <div className="controls">
            <label>
              <input
                type="checkbox"
                checked={hideCompleted}
                onChange={() => setHideCompleted((prev) => !prev)}
              />
              완료된 항목 숨기기
            </label>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <CalendarView todos={sortedTodos} onDateClick={handleDateClick} />

          <TodoList
            todos={todosToShow}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            categoryColorMap={categoryColorMap}
          />
        </>
      )}
    </div>
  );
}
