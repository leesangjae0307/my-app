import React, { useState } from "react";
import PropTypes from "prop-types";
import "./TodoForm.css";

function TodoForm({ addTodo }) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !dueDate) return;
    addTodo(text, dueDate, category);
    setText("");
    setDueDate("");
    setCategory("");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <input
        type="datetime-local"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="카테고리 (선택)"
      />
      <button type="submit">추가</button>
    </form>
  );
}

TodoForm.propTypes = {
  addTodo: PropTypes.func.isRequired,
};

export default React.memo(TodoForm);
