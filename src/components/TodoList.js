import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TodoItem from "./TodoItem";
import "./TodoList.css";

function TodoList({
  todos,
  toggleTodo,
  deleteTodo,
  updateTodo,
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
          updateTodo={updateTodo}
          categoryColorMap={categoryColorMap}
          currentTime={currentTime}
        />
      ))}
    </ul>
  );
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      dueDate: PropTypes.string.isRequired,
      category: PropTypes.string,
    })
  ).isRequired,
  toggleTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  updateTodo: PropTypes.func.isRequired,
  categoryColorMap: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default React.memo(TodoList);
