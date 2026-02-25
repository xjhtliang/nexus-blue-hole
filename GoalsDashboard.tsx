
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNeuronStore } from '../../../../store/useNeuronStore';
import { 
    DashboardLayout
} from '../../../../components/dashboard/NeuronDashboardComponents';
import { Plus } from 'lucide-react';
import dayjs from 'dayjs';

const GoalsDashboard = () => {
    const { t } = useTranslation(['neuron', 'common']);
    const { goals } = useNeuronStore();
    
    // Aggregates
    const activeGoals = goals.filter(g => g.status === 'IN_PROGRESS');
    const completedGoals = goals.filter(g => g.status === 'COMPLETED');
    const totalGoals = goals.length;
    const completionRate = totalGoals > 0 ? Math.round((completedGoals.length / totalGoals) * 100) : 0;

    // Milestones
    let totalMilestones = 0;
    let completedMilestones = 0;
    let blockedMilestones = 0;
    
    goals.forEach(g => {
        g.milestones.forEach(m => {
            totalMilestones++;
            if (m.status === 'COMPLETED') completedMilestones++;
            if (m.status === 'BLOCKED') blockedMilestones++;
        });
    });

    const expiringSoon = goals
        .filter(g => g.status === 'IN_PROGRESS' && dayjs(g.endDate).diff(dayjs(), 'day') < 30)
        .sort((a,b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
        .slice(0, 3);

    return (
        <DashboardLayout
            titleKey="dashboard.goals.title"
            descriptionKey="dashboard.goals.description"
            actions={[
                { label: t('dashboard.goals.viewTracker', { ns: 'neuron' }), href: '/neuron/goals/list' },
                { label: t('dashboard.goals.setGoal', { ns: 'neuron' }), icon: Plus, primary: true, href: '/neuron/goals/list' }
            ]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-card border border-border rounded-xl p-6 mb-4 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.goals.progressOverview', { ns: 'neuron' })}</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2 text-sm">
                                    <span>{t('dashboard.goals.annualCompletion', { ns: 'neuron' })}</span>
                                    <span className="font-bold">{completionRate}%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
                                    <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                                    <div className="text-sm text-blue-600 font-medium">{t('dashboard.goals.completed', { ns: 'neuron' })}</div>
                                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{completedGoals.length}</div>
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
                                    <div className="text-sm text-amber-600 font-medium">{t('dashboard.goals.inProgress', { ns: 'neuron' })}</div>
                                    <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">{activeGoals.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.goals.expiringSoon', { ns: 'neuron' })}</h2>
                        <div className="space-y-3">
                            {expiringSoon.map(g => {
                                const daysLeft = dayjs(g.endDate).diff(dayjs(), 'day');
                                const percent = g.milestones.length > 0 
                                    ? Math.round((g.milestones.filter(m => m.status === 'COMPLETED').length / g.milestones.length) * 100)
                                    : 0;
                                    
                                return (
                                    <div key={g.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/10">
                                        <div className="flex-1 mr-4">
                                            <div className="font-medium text-sm">{g.title}</div>
                                            <div className="text-xs text-red-500 font-medium">{daysLeft} {t('dashboard.goals.daysRemaining', { ns: 'neuron' })}</div>
                                        </div>
                                        <div className="w-24 bg-secondary rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                            {expiringSoon.length === 0 && <div className="text-muted-foreground text-sm">No goals expiring within 30 days.</div>}
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.goals.milestoneStatus', { ns: 'neuron' })}</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center p-2 rounded hover:bg-secondary/50">
                                <span>{t('dashboard.goals.completed', { ns: 'neuron' })}</span>
                                <span className="font-bold text-green-600">{completedMilestones}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 rounded hover:bg-secondary/50">
                                <span>{t('dashboard.goals.inProgress', { ns: 'neuron' })}</span>
                                <span className="font-bold text-blue-600">{totalMilestones - completedMilestones - blockedMilestones}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 rounded hover:bg-secondary/50">
                                <span>{t('dashboard.goals.blocked', { ns: 'neuron' })}</span>
                                <span className="font-bold text-red-600">{blockedMilestones}</span>
                            </div>
                            <div className="border-t border-border pt-2 flex justify-between items-center px-2">
                                <span className="font-medium">{t('dashboard.goals.total', { ns: 'neuron' })}</span>
                                <span className="font-bold">{totalMilestones}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.goals.distribution', { ns: 'neuron' })}</h2>
                        <div className="space-y-2 text-sm">
                            {['WORK', 'LIFE', 'HEALTH', 'STUDY'].map(domain => {
                                const count = goals.filter(g => g.domain === domain).length;
                                if (count === 0) return null;
                                return (
                                    <div key={domain} className="flex justify-between items-center">
                                        <span className="capitalize text-muted-foreground">{domain.toLowerCase()}</span>
                                        <span className="font-medium bg-secondary px-2 py-0.5 rounded text-xs">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default GoalsDashboard;
