import React from "react";
import TodoItem from "./TodoItem";
import "./TodoList.css";

export default function TodoList({
  todos,
  toggleTodo,
  deleteTodo,
  categoryColorMap,
}) {
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
        />
      ))}
    </ul>
  );
}
