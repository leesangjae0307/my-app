import React, { useMemo } from "react";
import PropTypes from "prop-types";
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

  return (
    <li className="todo-item" style={{ backgroundColor }}>
      <div onClick={handleToggle} className={todo.completed ? "completed" : ""}>
        {todo.text} [{category}]
      </div>
      <div className="todo-footer">
        <span>
          {timeLeft} ({todo.dueDate})
        </span>
        <button onClick={handleDelete}>삭제</button>
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
