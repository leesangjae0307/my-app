import React, { useState, useMemo } from "react";
import "./CalendarView.css";

export default function CalendarView({ todos, onDateClick, selectedDate }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const prevMonth = () => {
    setMonth((m) => (m === 0 ? (setYear((y) => y - 1), 11) : m - 1));
  };
  const nextMonth = () => {
    setMonth((m) => (m === 11 ? (setYear((y) => y + 1), 0) : m + 1));
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const dates = [];
  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let d = 1; d <= daysInMonth; d++) dates.push(d);

  const todoCountMap = useMemo(() => {
    const map = {};
    todos.forEach((t) => {
      const dayStr = t.dueDate.slice(0, 10);
      if (!map[dayStr]) {
        map[dayStr] = { total: 0, completed: 0 };
      }
      map[dayStr].total += 1;
      if (t.completed) {
        map[dayStr].completed += 1;
      }
    });
    return map;
  }, [todos]);

  return (
    <div className="calendar-container">
      <div className="calendar-header-nav">
        <button onClick={prevMonth}>◀ 이전</button>
        <h3 className="calendar-title">
          {year}년 {month + 1}월
          {selectedDate ? ` ${new Date(selectedDate).getDate()}일` : ""}
        </h3>
        <button onClick={nextMonth}>다음 ▶</button>
      </div>

      <div className="calendar-grid">
        {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
          <div key={d} className="calendar-header">
            {d}
          </div>
        ))}

        {dates.map((day, idx) => {
          const dayStr = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;
          const counts = todoCountMap[dayStr] || { total: 0, completed: 0 };
          const remaining = counts.total - counts.completed;

          return (
            <div
              key={idx}
              className={`calendar-cell ${day ? "clickable" : "empty"}`}
              onClick={() => day && onDateClick(dayStr)}
            >
              {day}
              {counts.total > 0 && (
                <div className="todo-count">
                  {remaining > 0 && (
                    <span className="remaining">{remaining}</span>
                  )}
                  {counts.completed > 0 && (
                    <span className="completed">{counts.completed}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
