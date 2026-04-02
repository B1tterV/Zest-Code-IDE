import { useState, useEffect, RefObject } from "react";

export const useAdaptiveMenu = (
  containerRef: RefObject<HTMLElement | null>,
  totalItems: any[],
) => {
  const [visibleCount, setVisibleCount] = useState(totalItems.length);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;

        if (width < 845) setVisibleCount(0);
        else if (width < 940) setVisibleCount(1);
        else if (width < 1020) setVisibleCount(2);
        else if (width < 1060) setVisibleCount(3);
        else if (width < 1100) setVisibleCount(4);
        else if (width < 1145) setVisibleCount(5);
        else if (width < 1215) setVisibleCount(6);
        else if (width < 1255) setVisibleCount(7);
        else setVisibleCount(totalItems.length);
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef, totalItems.length]);

  return {
    visibleItems: totalItems.slice(0, visibleCount),
    overflowItems: totalItems.slice(visibleCount),
  };
};
