import { useMemo } from "react";

export function useSortedTodos(todos) {
  return useMemo(() => {
    return [...todos].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [todos]);
}
