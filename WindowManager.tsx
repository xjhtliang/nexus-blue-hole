import React from 'react';
import { useWindowStore } from '../../../store/useWindowStore';
import { FloatingWindow } from './FloatingWindow';

export const WindowManager: React.FC = () => {
    const { windows } = useWindowStore();

    if (windows.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            {/* Pointer events auto allows clicking through empty space to app behind */}
            <div className="w-full h-full relative pointer-events-auto"> 
                {windows.map(window => (
                    <FloatingWindow key={window.id} window={window} />
                ))}
            </div>
        </div>
    );
};