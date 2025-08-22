import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import "./TodoList.css";

export default function TodoList({
  todos,
  toggleTodo,
  deleteTodo,
  categoryColorMap,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1초마다 currentTime 업데이트 → 모든 TodoItem에 전달
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (todos.length === 0) return <p className="empty">할 일이 없습니다 ✏️</p>;

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          categoryColorMap={categoryColorMap}
          currentTime={currentTime} // 타이머 전달
        />
      ))}
    </ul>
  );
}
