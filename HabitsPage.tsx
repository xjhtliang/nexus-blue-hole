
import React, { useEffect } from 'react';
import { useRightBrainStore } from '../../../store/useRightBrainStore';
import { HabitHeatmap } from '../components/HabitHeatmap';
import { Check, Flame, Plus, Zap } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useTranslation } from 'react-i18next';

export const HabitsPage: React.FC = () => {
    const { t } = useTranslation('life');
    const { habits, fetchHabits, toggleHabit, isLoading } = useRightBrainStore();

    useEffect(() => {
        fetchHabits();
    }, []);

    const sortedHabits = [...habits].sort((a, b) => {
        // Uncompleted first, then by title
        if (a.completedToday === b.completedToday) return a.title.localeCompare(b.title);
        return a.completedToday ? 1 : -1;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('habits.title')}</h1>
                    <p className="text-muted-foreground">{t('habits.subtitle')}</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    {t('habits.newHabit')}
                </button>
            </div>

            {/* Heatmap Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <h3 className="font-semibold text-sm">{t('habits.consistency')}</h3>
                </div>
                <HabitHeatmap habits={habits} />
            </div>

            {/* Habits List Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? <p>{t('habits.loading')}</p> : sortedHabits.map(habit => (
                    <div 
                        key={habit.id} 
                        className={cn(
                            "group relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md",
                            habit.completedToday 
                                ? "bg-secondary/30 border-transparent" 
                                : "bg-card border-border"
                        )}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className={cn("font-medium transition-colors", habit.completedToday && "text-muted-foreground line-through")}>
                                    {habit.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">{habit.frequency}</p>
                            </div>
                            <button
                                onClick={() => toggleHabit(habit.id)}
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                    habit.completedToday 
                                        ? "bg-green-500 text-white scale-110" 
                                        : "bg-secondary hover:bg-green-500/20 text-muted-foreground hover:text-green-500"
                                )}
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs">
                            <div className={cn("flex items-center gap-1 font-medium", habit.completedToday ? "text-orange-500" : "text-muted-foreground")}>
                                <Flame className={cn("w-3 h-3", habit.completedToday && "fill-orange-500")} />
                                <span>{habit.streak} {t('habits.streak')}</span>
                            </div>
                            <div className="text-muted-foreground">
                                {t('habits.bestStreak')}: {habit.bestStreak}
                            </div>
                        </div>

                        {/* Progress bar background for visual flair */}
                         <div 
                            className="absolute bottom-0 left-0 h-1 bg-green-500/20 transition-all duration-500" 
                            style={{ width: `${Math.min(100, (habit.streak / 30) * 100)}%` }} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
