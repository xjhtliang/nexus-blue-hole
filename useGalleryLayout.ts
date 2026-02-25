import { useState, useEffect, useRef, useCallback } from 'react';

interface GalleryLayoutOptions {
  minColumnWidth?: number;
  gap?: number;
}

interface GalleryLayoutResult {
  containerRef: React.RefObject<HTMLDivElement>;
  columns: number;
  containerWidth: number;
}

export const useGalleryLayout = ({ 
  minColumnWidth = 250, 
  gap = 16 
}: GalleryLayoutOptions = {}): GalleryLayoutResult => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);

  const calculateLayout = useCallback(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.getBoundingClientRect().width;
    setContainerWidth(width);

    // Calculate columns: (width + gap) / (minWidth + gap)
    // Example: Width 1000, min 250, gap 16.
    // (1000 + 16) / (266) ~= 3.8 => 3 columns
    const calculatedColumns = Math.max(
      1, 
      Math.floor((width + gap) / (minColumnWidth + gap))
    );

    setColumns(calculatedColumns);
  }, [minColumnWidth, gap]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Initial calculation
    calculateLayout();

    const observer = new ResizeObserver((entries) => {
      // Use requestAnimationFrame to throttle resize events slightly
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) return;
        calculateLayout();
      });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [calculateLayout]);

  return {
    containerRef,
    columns,
    containerWidth
  };
};