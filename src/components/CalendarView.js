import React, { useState } from "react";
import "./CalendarView.css";

export default function CalendarView({ todos, onDateClick }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0~11

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  // 해당 월의 날짜 배열 생성
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0:일, 6:토

  const dates = [];
  for (let i = 0; i < firstDay; i++) dates.push(null);
  for (let d = 1; d <= daysInMonth; d++) dates.push(d);

  // 날짜별 할 일 표시 여부
  const getTodoCount = (day) => {
    if (!day) return 0;
    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return todos.filter((t) => t.dueDate.slice(0, 10) === dayStr).length;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header-nav">
        <button onClick={prevMonth}>◀ 이전</button>
        <h3>
          {year}년 {month + 1}월
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
          const count = getTodoCount(day);
          return (
            <div
              key={idx}
              className={`calendar-cell ${day ? "clickable" : "empty"}`}
              onClick={() =>
                day &&
                onDateClick(
                  `${year}-${String(month + 1).padStart(2, "0")}-${String(
                    day
                  ).padStart(2, "0")}`
                )
              }
            >
              {day}
              {count > 0 && <div className="todo-count">{count}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
