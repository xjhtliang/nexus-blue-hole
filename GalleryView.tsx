import React from 'react';
import { cn } from '../../../lib/utils';

interface GalleryViewProps<T> {
    data: T[];
    renderCard: (item: T) => React.ReactNode;
    keyExtractor: (item: T) => string;
}

export function GalleryView<T>({ 
    data, 
    renderCard,
    keyExtractor 
}: GalleryViewProps<T>) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map(item => (
                <div key={keyExtractor(item)} className="h-full">
                    {renderCard(item)}
                </div>
            ))}
        </div>
    );
}