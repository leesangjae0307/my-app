import { useMemo } from "react";

export function useTodoFilters(
  todos,
  { hideCompleted, categoryFilter, searchTerm }
) {
  return useMemo(() => {
    return todos.filter((todo) => {
      if (hideCompleted && todo.completed) return false;
      if (categoryFilter !== "All" && todo.category !== categoryFilter)
        return false;
      if (
        searchTerm &&
        !todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  }, [todos, hideCompleted, categoryFilter, searchTerm]);
}
