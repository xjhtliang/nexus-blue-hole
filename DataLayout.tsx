import React from 'react';
import { LayoutGrid, List, Table2, Kanban, CalendarClock } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type LayoutMode = 'TABLE' | 'BOARD' | 'LIST' | 'GALLERY' | 'TIMELINE';

interface DataLayoutProps {
    mode: LayoutMode;
    onModeChange: (mode: LayoutMode) => void;
    children: React.ReactNode;
    title?: string;
    actions?: React.ReactNode;
}

export const DataLayout: React.FC<DataLayoutProps> = ({ 
    mode, 
    onModeChange, 
    children,
    title,
    actions 
}) => {
    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {title && (
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                )}
                
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center bg-card border border-border p-1 rounded-lg">
                        <button
                            onClick={() => onModeChange('BOARD')}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                mode === 'BOARD' ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/50"
                            )}
                            title="Board View"
                        >
                            <Kanban className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onModeChange('TABLE')}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                mode === 'TABLE' ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/50"
                            )}
                            title="Table View"
                        >
                            <Table2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onModeChange('LIST')}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                mode === 'LIST' ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/50"
                            )}
                            title="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                         <button
                            onClick={() => onModeChange('GALLERY')}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                mode === 'GALLERY' ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/50"
                            )}
                            title="Gallery View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onModeChange('TIMELINE')}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                mode === 'TIMELINE' ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary/50"
                            )}
                            title="Timeline View"
                        >
                            <CalendarClock className="w-4 h-4" />
                        </button>
                    </div>
                    
                    {actions && <div className="h-6 w-px bg-border mx-1 hidden sm:block" />}
                    
                    {actions}
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 min-h-0 relative">
                {children}
            </div>
        </div>
    );
};