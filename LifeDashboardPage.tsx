
import React, { useEffect } from 'react';
import { useRightBrainStore } from '../../../store/useRightBrainStore';
import { LifeWheel } from '../components/LifeWheel';
import { Activity, Target, Heart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const LifeDashboardPage: React.FC = () => {
    const { t } = useTranslation(['life', 'common']);
    const { fetchDashboardData, lifeGoals, lifeWheel, isLoading } = useRightBrainStore();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (isLoading) return <div className="p-8">{t('common:loading')}</div>;

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('life:dashboard.title')}</h1>
                    <p className="text-muted-foreground">{t('life:dashboard.subtitle')}</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Life Wheel Card */}
                <div className="col-span-1 lg:col-span-1 bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-4 h-4 text-green-500" />
                        <h3 className="font-semibold text-sm">{t('life:dashboard.balance')}</h3>
                    </div>
                    <LifeWheel data={lifeWheel} />
                </div>

                {/* Goals Summary */}
                <div className="col-span-1 lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            <h3 className="font-semibold text-sm">{t('life:dashboard.activeGoals')}</h3>
                        </div>
                        <Link to="/life/goals" className="text-xs text-primary hover:underline">{t('life:dashboard.viewAll')}</Link>
                    </div>

                    <div className="space-y-6">
                        {lifeGoals.slice(0, 3).map(goal => (
                            <div key={goal.id}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-medium">{goal.title}</span>
                                    <span className="text-muted-foreground">{goal.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-500 rounded-full" 
                                        style={{ width: `${goal.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/life/habits" className="p-4 bg-secondary/30 border border-border rounded-lg hover:bg-secondary/50 transition-colors flex flex-col items-center justify-center gap-2 text-center">
                        <Heart className="w-6 h-6 text-red-500" />
                        <span className="font-medium text-sm">{t('life:habits.title')}</span>
                    </Link>
                    <Link to="/life/finance" className="p-4 bg-secondary/30 border border-border rounded-lg hover:bg-secondary/50 transition-colors flex flex-col items-center justify-center gap-2 text-center">
                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                        <span className="font-medium text-sm">{t('life:finance.title')}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
