import React, { useRef, useState, useEffect } from 'react';

interface VirtualListProps<T> {
    items: T[];
    height: number;
    itemHeight: number;
    renderItem: (item: T, index: number) => React.ReactNode;
}

export function VirtualList<T>({ items, height, itemHeight, renderItem }: VirtualListProps<T>) {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const totalHeight = items.length * itemHeight;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(height / itemHeight);
    // Render buffer
    const endIndex = Math.min(items.length, startIndex + visibleCount + 5);
    const startOffset = startIndex * itemHeight;

    const visibleItems = items.slice(startIndex, endIndex);

    const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    };

    return (
        <div 
            ref={containerRef}
            onScroll={onScroll}
            style={{ height, overflowY: 'auto', position: 'relative' }}
            className="w-full scrollbar-thin"
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${startOffset}px)` }}>
                    {visibleItems.map((item, index) => renderItem(item, startIndex + index))}
                </div>
            </div>
        </div>
    );
}