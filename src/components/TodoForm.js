import React, { useState } from "react";
import PropTypes from "prop-types";
import "./TodoForm.css";

function TodoForm({ addTodo, categories = [], onAddCategory }) {
  const [text, setText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || !dueDate) return;
    addTodo(text, dueDate, category, startDate);
    setText("");
    setStartDate("");
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
      <div className="date-inputs">
        <div className="date-input">
          <label>시작일</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="date-input">
          <label>마감일</label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
      <div className="category-input">
        {isAddingCategory ? (
          <div className="new-category">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="새 카테고리 입력"
            />
            <button
              type="button"
              onClick={() => {
                if (newCategory.trim()) {
                  const trimmedCategory = newCategory.trim();
                  onAddCategory?.(trimmedCategory);
                  setCategory(trimmedCategory);
                  setNewCategory("");
                  setIsAddingCategory(false);
                }
              }}
            >
              확인
            </button>
            <button
              type="button"
              onClick={() => {
                setNewCategory("");
                setIsAddingCategory(false);
              }}
            >
              취소
            </button>
          </div>
        ) : (
          <div className="category-select">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">카테고리 선택</option>
              {categories
                .filter((cat) => cat !== "All")
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
            <button type="button" onClick={() => setIsAddingCategory(true)}>
              새 카테고리
            </button>
          </div>
        )}
      </div>
      <button type="submit">추가</button>
    </form>
  );
}

TodoForm.propTypes = {
  addTodo: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string),
  onAddCategory: PropTypes.func,
};

export default React.memo(TodoForm);
