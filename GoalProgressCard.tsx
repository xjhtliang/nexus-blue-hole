
import React from 'react';
import { Goal } from '../../../../types/leftBrain';
import { cn, formatCurrency } from '../../../../lib/utils';
import { Target, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GoalProgressCardProps {
    goal: Goal;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal }) => {
    const { t } = useTranslation('work');
    const percentage = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
    
    // Status Logic
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ON_TRACK': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'AT_RISK': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'BEHIND': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'COMPLETED': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            default: return 'text-muted-foreground bg-secondary border-border';
        }
    };

    const getIcon = (status: string) => {
        switch (status) {
            case 'AT_RISK': return <AlertTriangle className="w-4 h-4" />;
            case 'COMPLETED': return <CheckCircle2 className="w-4 h-4" />;
            default: return <Target className="w-4 h-4" />;
        }
    };

    const formatValue = (val: number) => {
        return goal.unit === 'CNY' ? formatCurrency(val) : `${val} ${goal.unit}`;
    };

    return (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1", getStatusColor(goal.status))}>
                            {getIcon(goal.status)}
                            {t(`goals.status.${goal.status}`, { defaultValue: goal.status })}
                        </span>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {t(`goals.filters.${goal.horizon.toLowerCase()}`, { defaultValue: goal.horizon })}
                        </span>
                    </div>
                    <h3 className="font-semibold text-lg tracking-tight">{goal.title}</h3>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold font-mono text-primary">
                        {percentage}%
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden mb-2">
                <div 
                    className={cn("h-full transition-all duration-1000 ease-out rounded-full", 
                        goal.status === 'AT_RISK' ? 'bg-amber-500' : 
                        goal.status === 'BEHIND' ? 'bg-red-500' : 'bg-primary'
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Stats */}
            <div className="flex justify-between items-end text-sm">
                <div>
                    <p className="text-muted-foreground text-xs">{t('goals.card.current')}</p>
                    <p className="font-medium">{formatValue(goal.currentValue)}</p>
                </div>
                <div className="text-right">
                     <p className="text-muted-foreground text-xs">{t('goals.card.target')}</p>
                     <p className="font-medium">{formatValue(goal.targetValue)}</p>
                </div>
            </div>

            {/* Forecast / Insight (Mocked) */}
            {goal.status !== 'COMPLETED' && (
                <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>
                        {percentage < 50 ? t('goals.card.insight.bad') : t('goals.card.insight.good')}
                    </span>
                </div>
            )}
        </div>
    );
};
