
import React, { useEffect, useState } from 'react';
import { useLeftBrainStore } from '../../../store/useLeftBrainStore';
import { GoalProgressCard } from '../components/goals/GoalProgressCard';
import { Plus } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useTranslation } from 'react-i18next';

export const GoalsPage: React.FC = () => {
    const { t } = useTranslation('work');
    const { goals, fetchGoals, isLoadingGoals } = useLeftBrainStore();
    const [viewHorizon, setViewHorizon] = useState<string>('MONTH');

    useEffect(() => {
        fetchGoals();
    }, []);

    const filteredGoals = goals.filter(g => viewHorizon === 'ALL' || g.horizon === viewHorizon);

    const HorizonTab = ({ value, label }: { value: string, label: string }) => (
        <button
            onClick={() => setViewHorizon(value)}
            className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                viewHorizon === value 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('goals.title')}</h1>
                    <p className="text-muted-foreground">{t('goals.description')}</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" />
                    {t('goals.setGoal')}
                </button>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border p-1 rounded-lg inline-flex flex-wrap gap-1">
                <HorizonTab value="ALL" label={t('goals.filters.overview')} />
                <HorizonTab value="YEAR" label={t('goals.filters.yearly')} />
                <HorizonTab value="QUARTER" label={t('goals.filters.quarterly')} />
                <HorizonTab value="MONTH" label={t('goals.filters.monthly')} />
            </div>

            {/* Content */}
            {isLoadingGoals ? (
                <div className="py-20 text-center text-muted-foreground">{t('goals.loading')}</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 animate-in fade-in duration-500">
                    {filteredGoals.map(goal => (
                        <GoalProgressCard key={goal.id} goal={goal} />
                    ))}
                    {filteredGoals.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
                            <p className="text-muted-foreground">{t('goals.empty')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
