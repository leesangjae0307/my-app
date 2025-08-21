import React, { useState, useEffect } from "react";
import "./TodoItem.css";

export default function TodoItem({
  todo,
  toggleTodo,
  deleteTodo,
  categoryColorMap,
}) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = new Date(todo.dueDate) - now;

      if (diff <= 0) {
        setTimeLeft("마감 지남");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초 남음`);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [todo.dueDate]);

  const isUrgent = timeLeft.includes("0일") || timeLeft.includes("마감 지남");
  const category = todo.category || "일반";
  const backgroundColor = isUrgent
    ? "#ffe5e5"
    : categoryColorMap[category] || "#fff";

  return (
    <li className="todo-item" style={{ backgroundColor }}>
      <div
        onClick={() => toggleTodo(todo.id)}
        className={todo.completed ? "completed" : ""}
      >
        {todo.text} [{category}]
      </div>
      <div className="todo-footer">
        <span>
          {timeLeft} ({todo.dueDate})
        </span>
        <button onClick={() => deleteTodo(todo.id)}>삭제</button>
      </div>
    </li>
  );
}
