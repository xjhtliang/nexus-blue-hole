
import React from 'react';
import { Habit } from '../../../types/rightBrain';
import dayjs from 'dayjs';
import { cn } from '../../../lib/utils';
import { useTranslation } from 'react-i18next';

// Generates an array of dates for the last year
const generateYearData = () => {
    const dates = [];
    const today = dayjs();
    // 52 weeks * 7 days
    for (let i = 0; i < 364; i++) {
        dates.unshift(today.subtract(i, 'day').format('YYYY-MM-DD'));
    }
    return dates;
};

interface HabitHeatmapProps {
    habits: Habit[];
}

export const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ habits }) => {
    const { t } = useTranslation('life');
    const dates = React.useMemo(() => generateYearData(), []);

    // Calculate intensity for each date (0-4) based on how many habits were completed
    const getActivityLevel = (date: string) => {
        let completedCount = 0;
        habits.forEach(h => {
            if (h.logs[date]) completedCount++;
        });
        
        if (habits.length === 0) return 0;
        const ratio = completedCount / habits.length;

        if (ratio === 0) return 0;
        if (ratio <= 0.25) return 1;
        if (ratio <= 0.5) return 2;
        if (ratio <= 0.75) return 3;
        return 4;
    };

    const getLevelColor = (level: number) => {
        switch (level) {
            case 0: return 'bg-secondary/50';
            case 1: return 'bg-green-900/40';
            case 2: return 'bg-green-700/60';
            case 3: return 'bg-green-500/80';
            case 4: return 'bg-green-400';
            default: return 'bg-secondary/50';
        }
    };

    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[700px]">
                <div className="flex gap-1">
                    {/* Simplified Grid: We'll split 364 days into 52 columns of 7 days */}
                    {Array.from({ length: 52 }).map((_, colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-1">
                            {Array.from({ length: 7 }).map((_, rowIndex) => {
                                const dateIndex = colIndex * 7 + rowIndex;
                                const date = dates[dateIndex];
                                const level = getActivityLevel(date);
                                
                                return (
                                    <div 
                                        key={date}
                                        className={cn("w-3 h-3 rounded-[2px] transition-colors", getLevelColor(level))}
                                        title={`${date}: ${level > 0 ? 'Active' : 'No activity'}`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground justify-end">
                <span>{t('habits.less')}</span>
                <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-secondary/50" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-green-900/40" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-green-700/60" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-green-500/80" />
                    <div className="w-2.5 h-2.5 rounded-[2px] bg-green-400" />
                </div>
                <span>{t('habits.more')}</span>
            </div>
        </div>
    );
};
