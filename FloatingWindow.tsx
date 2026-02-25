import React, { useState, useRef, useEffect } from 'react';
import { useWindowStore, FloatingWindow as FloatingWindowType } from '../../../store/useWindowStore';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const FloatingWindow: React.FC<{ window: FloatingWindowType }> = ({ window }) => {
    const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition } = useWindowStore();
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (window.isMaximized) return;
        focusWindow(window.id);
        setIsDragging(true);
        dragOffset.current = {
            x: e.clientX - window.position.x,
            y: e.clientY - window.position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const newX = e.clientX - dragOffset.current.x;
            const newY = e.clientY - dragOffset.current.y;
            updateWindowPosition(window.id, { x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, window.id, updateWindowPosition]);

    if (window.isMinimized) return null; // Logic handled by taskbar usually

    const style: React.CSSProperties = window.isMaximized 
        ? { top: 0, left: 0, width: '100vw', height: '100vh', zIndex: window.zIndex + 100 }
        : { top: window.position.y, left: window.position.x, width: window.size.width, height: window.size.height, zIndex: window.zIndex };

    return (
        <div 
            className={cn(
                "fixed bg-background border border-border shadow-2xl rounded-lg flex flex-col overflow-hidden transition-shadow",
                isDragging && "opacity-90 cursor-grabbing",
                "animate-in zoom-in-95 duration-200"
            )}
            style={style}
            onMouseDown={() => focusWindow(window.id)}
        >
            {/* Header / Drag Handle */}
            <div 
                className="h-9 bg-secondary/80 border-b border-border flex items-center justify-between px-3 select-none cursor-grab active:cursor-grabbing backdrop-blur-sm"
                onMouseDown={handleMouseDown}
                onDoubleClick={() => maximizeWindow(window.id)}
            >
                <div className="text-xs font-medium">{window.title}</div>
                <div className="flex items-center gap-2">
                    <button onClick={() => minimizeWindow(window.id)} className="hover:text-primary">
                        <Minus className="w-3 h-3" />
                    </button>
                    <button onClick={() => maximizeWindow(window.id)} className="hover:text-primary">
                        {window.isMaximized ? <Square className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                    </button>
                    <button onClick={() => closeWindow(window.id)} className="hover:text-destructive">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 bg-card/50">
                {window.content}
            </div>

            {/* Resizer Handle (Simplified) */}
            {!window.isMaximized && (
                <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />
            )}
        </div>
    );
};