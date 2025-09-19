import React, { useState, useMemo } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import Signup from "./components/Signup";
import Login from "./components/Login";
import CalendarView from "./components/CalendarView";
import { AppProvider, useAppContext, ActionTypes } from "./context/AppContext";
import { useTodoFilters } from "./hooks/useTodoFilters";
import { useSortedTodos } from "./hooks/useSortedTodos";
import { useCategoryColors } from "./hooks/useCategoryColors";
import "./App.css";

function AppContent() {
  const { state, dispatch } = useAppContext();
  const { currentUser, users, todos } = state;
  const userTodos = useMemo(
    () => (currentUser ? todos[currentUser] || [] : []),
    [currentUser, todos]
  );

  const [showSignup, setShowSignup] = useState(false);
  const [originalAdmin, setOriginalAdmin] = useState(null);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);

  const isAdmin = currentUser === "admin";

  const filteredTodos = useTodoFilters(userTodos, {
    hideCompleted,
    categoryFilter,
    searchTerm,
  });

  const sortedTodos = useSortedTodos(filteredTodos);

  const todosToShow = selectedDate
    ? sortedTodos.filter((t) => t.dueDate.slice(0, 10) === selectedDate)
    : sortedTodos;

  const categories = useMemo(() => {
    const todoCategories = new Set(userTodos.map((todo) => todo.category));
    if (!state.categories?.[currentUser]) {
      return ["All", ...Array.from(todoCategories)];
    }
    return [
      "All",
      ...state.categories[currentUser],
      ...Array.from(todoCategories),
    ];
  }, [userTodos, state.categories, currentUser]);

  const handleAddCategory = (newCategory) => {
    const existingCategories = state.categories?.[currentUser] || [];
    if (!existingCategories.includes(newCategory)) {
      dispatch({
        type: ActionTypes.UPDATE_CATEGORIES,
        payload: {
          ...state.categories,
          [currentUser]: [...existingCategories, newCategory],
        },
      });
    }
  };

  const BASE_COLORS = ["#ffd6d6", "#d6f0ff", "#d6ffd8", "#fff6d6", "#f0d6ff"];
  const categoryColorMap = useCategoryColors(categories, BASE_COLORS);

  const addTodo = (text, dueDate, category, startDate) => {
    const newTodos = [
      ...userTodos,
      {
        id: Date.now(),
        text,
        startDate: startDate || dueDate, // 시작일이 없으면 마감일과 동일하게 설정
        dueDate,
        category: category || "일반",
        completed: false,
      },
    ];
    dispatch({
      type: ActionTypes.UPDATE_TODOS,
      payload: newTodos,
    });
  };

  const toggleTodo = (id) => {
    const newTodos = userTodos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    dispatch({
      type: ActionTypes.UPDATE_TODOS,
      payload: newTodos,
    });
  };

  const deleteTodo = (id) => {
    const newTodos = userTodos.filter((todo) => todo.id !== id);
    dispatch({
      type: ActionTypes.UPDATE_TODOS,
      payload: newTodos,
    });
  };

  const updateTodo = (id, updatedTodo) => {
    const newTodos = userTodos.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );
    dispatch({
      type: ActionTypes.UPDATE_TODOS,
      payload: newTodos,
    });
  };

  const logout = () => {
    dispatch({ type: ActionTypes.LOGOUT });
    setOriginalAdmin(null);
  };

  const deleteUser = (email) => {
    if (!isAdmin && currentUser !== originalAdmin) {
      alert("관리자만 삭제 가능합니다.");
      return;
    }
    const newUsers = users.filter((u) => u.email !== email);
    dispatch({ type: ActionTypes.UPDATE_USERS, payload: newUsers });

    if (currentUser === email) {
      dispatch({
        type: ActionTypes.SET_CURRENT_USER,
        payload: originalAdmin || null,
      });
    }
  };

  const viewUserTodos = (email) => {
    if (!isAdmin) return;
    if (!originalAdmin) setOriginalAdmin(currentUser);
    dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: email });
    setSelectedDate(null);
  };

  const returnAdmin = () => {
    if (originalAdmin) {
      dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: originalAdmin });
      setOriginalAdmin(null);
      setSelectedDate(null);
    }
  };

  const handleDateClick = (dateStr) => setSelectedDate(dateStr);

  return (
    <div className="app-container">
      {!currentUser ? (
        showSignup ? (
          <Signup setShowSignup={setShowSignup} dispatch={dispatch} />
        ) : (
          <Login setShowSignup={setShowSignup} dispatch={dispatch} />
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
              {users.map((user) => (
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

          <TodoForm
            addTodo={addTodo}
            categories={categories}
            onAddCategory={handleAddCategory}
          />

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

          <CalendarView
            todos={sortedTodos}
            onDateClick={handleDateClick}
            selectedDate={selectedDate}
            addTodo={addTodo}
            categories={categories}
          />

          <TodoList
            todos={todosToShow}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            categoryColorMap={categoryColorMap}
          />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
