import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '../../../lib/utils';
import { 
    ZoomIn, 
    ZoomOut, 
    Move, 
    Download, 
    ChevronLeft, 
    ChevronRight, 
    Calendar 
} from 'lucide-react';
import { calculatePosition, calculateWidth, generateTimeTicks } from '../../../lib/timeline/timelineCalculator';
import { calculateLanes, RenderedItem } from '../../../lib/timeline/timelineRenderer';
import { zoomTimeline, panTimeline } from '../../../lib/timeline/timelineInteractions';
import { exportTimelineData } from '../../../lib/timeline/timelineExport';
import dayjs from 'dayjs';

interface TimelineViewProps<T> {
    items: T[];
    startDateAccessor: (item: T) => Date;
    endDateAccessor?: (item: T) => Date;
    titleAccessor?: (item: T) => string;
    renderItem?: (item: T, style: React.CSSProperties) => React.ReactNode;
    initialStartDate?: Date;
    initialEndDate?: Date;
    className?: string;
    onItemClick?: (item: T) => void;
}

export function TimelineView<T extends { id: string }>({
    items,
    startDateAccessor,
    endDateAccessor,
    titleAccessor,
    renderItem,
    initialStartDate,
    initialEndDate,
    className,
    onItemClick
}: TimelineViewProps<T>) {
    // Default view range: Last 7 days to next 7 days if not provided
    const [viewStart, setViewStart] = useState<Date>(initialStartDate || dayjs().subtract(7, 'day').toDate());
    const [viewEnd, setViewEnd] = useState<Date>(initialEndDate || dayjs().add(7, 'day').toDate());
    
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(1000);
    const [isDragging, setIsDragging] = useState(false);
    const lastMouseX = useRef<number>(0);

    // Update container width on resize
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                setContainerWidth(entries[0].contentRect.width);
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // 1. Prepare Data
    const timelineItems = useMemo(() => {
        return items.map(item => ({
            ...item,
            start: startDateAccessor(item),
            end: endDateAccessor ? endDateAccessor(item) : undefined,
            title: titleAccessor ? titleAccessor(item) : (item as any).title || item.id,
        }));
    }, [items, startDateAccessor, endDateAccessor, titleAccessor]);

    // 2. Calculate Layout (Lanes)
    const layoutItems = useMemo(() => calculateLanes(timelineItems), [timelineItems]);
    const totalLanes = Math.max(1, Math.max(...layoutItems.map(i => i.lane)) + 1);

    // 3. Calculate Ticks
    const ticks = useMemo(() => generateTimeTicks(viewStart, viewEnd), [viewStart, viewEnd]);

    // --- Interactions ---

    const handleZoom = (direction: 'in' | 'out') => {
        const factor = direction === 'in' ? 0.8 : 1.25;
        const { start, end } = zoomTimeline(viewStart, viewEnd, factor);
        setViewStart(start);
        setViewEnd(end);
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Zoom
            const factor = e.deltaY > 0 ? 1.05 : 0.95;
            const { start, end } = zoomTimeline(viewStart, viewEnd, factor);
            setViewStart(start);
            setViewEnd(end);
        } else {
            // Pan
            const { start, end } = panTimeline(viewStart, viewEnd, e.deltaX + e.deltaY, containerWidth);
            setViewStart(start);
            setViewEnd(end);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        lastMouseX.current = e.clientX;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const delta = lastMouseX.current - e.clientX;
        lastMouseX.current = e.clientX;
        
        const { start, end } = panTimeline(viewStart, viewEnd, delta, containerWidth);
        setViewStart(start);
        setViewEnd(end);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleReset = () => {
        setViewStart(dayjs().subtract(3, 'day').toDate());
        setViewEnd(dayjs().add(10, 'day').toDate());
    };

    // --- Rendering Helpers ---
    
    const LANE_HEIGHT = 40;
    const HEADER_HEIGHT = 40;
    const totalDuration = viewEnd.getTime() - viewStart.getTime();

    return (
        <div className={cn("flex flex-col h-full bg-background border border-border rounded-xl overflow-hidden shadow-sm select-none", className)}>
            
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-border bg-card/50">
                <div className="flex items-center gap-2">
                    <button onClick={() => handleZoom('in')} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Zoom In">
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleZoom('out')} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Zoom Out">
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-border mx-1" />
                    <button onClick={handleReset} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-xs font-medium px-3">
                        Today
                    </button>
                    <div className="text-xs text-muted-foreground ml-4 font-mono">
                        {dayjs(viewStart).format('MMM D')} - {dayjs(viewEnd).format('MMM D, YYYY')}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                     <button onClick={() => exportTimelineData(timelineItems, 'CSV')} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Export CSV">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Timeline Area */}
            <div 
                className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
                ref={containerRef}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Grid Background (Ticks) */}
                <div className="absolute inset-0 pointer-events-none">
                    {ticks.map((tick, i) => (
                        <div 
                            key={i} 
                            className="absolute top-0 bottom-0 border-l border-border/40 text-[10px] text-muted-foreground pt-2 pl-1.5"
                            style={{ left: `${tick.percent}%` }}
                        >
                            {tick.label}
                        </div>
                    ))}
                    {/* Current Time Indicator */}
                    {dayjs().isAfter(viewStart) && dayjs().isBefore(viewEnd) && (
                        <div 
                            className="absolute top-0 bottom-0 border-l-2 border-red-500 z-10"
                            style={{ left: `${calculatePosition(new Date(), viewStart, totalDuration, containerWidth)}px` }}
                        >
                            <div className="absolute -top-1 -left-[3px] w-2 h-2 bg-red-500 rounded-full" />
                        </div>
                    )}
                </div>

                {/* Items Canvas */}
                <div className="absolute inset-0 top-[40px] overflow-y-auto scrollbar-thin">
                    <div style={{ height: totalLanes * LANE_HEIGHT + 100, position: 'relative' }}>
                        {layoutItems.map((item) => {
                            const left = calculatePosition(item.start, viewStart, totalDuration, containerWidth);
                            const width = calculateWidth(item.start, item.end, totalDuration, containerWidth);
                            
                            // Skip items currently out of view
                            if (left + width < 0 || left > containerWidth) return null;

                            const style: React.CSSProperties = {
                                position: 'absolute',
                                left: `${left}px`,
                                width: `${width}px`,
                                top: `${item.lane * LANE_HEIGHT + 10}px`,
                                height: `${LANE_HEIGHT - 8}px`, // Gap
                            };

                            return (
                                <div 
                                    key={item.id} 
                                    style={style}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onItemClick?.(item as any);
                                    }}
                                    className="group"
                                >
                                    {renderItem ? renderItem(item as any, style) : (
                                        <div className="w-full h-full bg-primary/20 border border-primary/50 rounded-md px-2 flex items-center text-xs text-primary-foreground font-medium truncate hover:bg-primary/30 transition-colors cursor-pointer shadow-sm overflow-hidden whitespace-nowrap">
                                             {item.title}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}