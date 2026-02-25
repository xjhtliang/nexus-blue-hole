import React from 'react';
import { cn } from '../../../lib/utils';
import { MoreHorizontal } from 'lucide-react';

interface ListViewProps<T> {
    data: T[];
    renderTitle: (item: T) => React.ReactNode;
    renderSubtitle?: (item: T) => React.ReactNode;
    renderMeta?: (item: T) => React.ReactNode;
    renderStatus?: (item: T) => React.ReactNode;
    onItemClick?: (item: T) => void;
    keyExtractor: (item: T) => string;
}

export function ListView<T>({ 
    data, 
    renderTitle, 
    renderSubtitle, 
    renderMeta, 
    renderStatus,
    onItemClick,
    keyExtractor 
}: ListViewProps<T>) {
    return (
        <div className="flex flex-col space-y-2">
            {data.map(item => (
                <div 
                    key={keyExtractor(item)}
                    onClick={() => onItemClick?.(item)}
                    className="group flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-sm hover:border-primary/50 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        {renderStatus && (
                            <div className="flex-shrink-0">
                                {renderStatus(item)}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">
                                {renderTitle(item)}
                            </div>
                            {renderSubtitle && (
                                <div className="text-sm text-muted-foreground truncate mt-0.5">
                                    {renderSubtitle(item)}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 ml-4">
                        {renderMeta && (
                            <div className="text-sm text-muted-foreground hidden sm:block">
                                {renderMeta(item)}
                            </div>
                        )}
                        <button className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}