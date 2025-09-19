import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import "./TodoItem.css";

function TodoItem({
  todo,
  toggleTodo,
  deleteTodo,
  updateTodo,
  categoryColorMap,
  currentTime,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // 날짜 포맷팅
  const formattedDate = useMemo(() => {
    const date = new Date(todo.dueDate);
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${month}월 ${day}일 (${weekday}) ${hours}:${minutes}`;
  }, [todo.dueDate]);

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

  const isUrgent = useMemo(
    () => timeLeft.includes("0일") || timeLeft.includes("마감 지남"),
    [timeLeft]
  );

  const category = todo.category || "일반";
  const backgroundColor = isUrgent
    ? "#ffe5e5"
    : categoryColorMap[category] || "#fff";

  const handleToggle = () => toggleTodo(todo.id);
  const handleDelete = () => deleteTodo(todo.id);

  const handleSave = () => {
    if (editText.trim()) {
      updateTodo(todo.id, { ...todo, text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditText(todo.text);
    }
  };

  return (
    <li className="todo-item" style={{ backgroundColor }}>
      <div className="todo-main">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="todo-checkbox"
        />
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            autoFocus
            className="todo-edit-input"
          />
        ) : (
          <div
            className={`todo-text ${todo.completed ? "completed" : ""}`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.text}
          </div>
        )}
      </div>
      <div className="todo-info">
        <span className="todo-category">[{category}]</span>
        <span className="todo-date" title={timeLeft}>
          {formattedDate}
        </span>
        <div className="todo-actions">
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            수정
          </button>
          <button onClick={handleDelete} className="delete-btn">
            삭제
          </button>
        </div>
      </div>
    </li>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    dueDate: PropTypes.string.isRequired,
    category: PropTypes.string,
  }).isRequired,
  toggleTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  categoryColorMap: PropTypes.objectOf(PropTypes.string).isRequired,
  currentTime: PropTypes.instanceOf(Date).isRequired,
};

export default React.memo(TodoItem, (prevProps, nextProps) => {
  return (
    prevProps.todo === nextProps.todo &&
    prevProps.currentTime === nextProps.currentTime &&
    prevProps.categoryColorMap === nextProps.categoryColorMap
  );
});
