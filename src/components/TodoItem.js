import React, { useMemo } from "react";
import "./TodoItem.css";

function TodoItem({
  todo,
  toggleTodo,
  deleteTodo,
  categoryColorMap,
  currentTime,
}) {
  // 남은 시간 계산
  const timeLeft = useMemo(() => {
    const diff = new Date(todo.dueDate) - currentTime;
    if (diff <= 0) return "마감 지남";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초 남음`;
  }, [todo.dueDate, currentTime]);

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

export default React.memo(TodoItem);
