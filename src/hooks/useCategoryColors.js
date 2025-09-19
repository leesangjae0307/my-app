import { useMemo } from "react";

export function useCategoryColors(categories, baseColors) {
  return useMemo(() => {
    const colorMap = {};
    categories.forEach(
      (cat, i) => (colorMap[cat] = baseColors[i % baseColors.length])
    );
    return colorMap;
  }, [categories, baseColors]);
}
