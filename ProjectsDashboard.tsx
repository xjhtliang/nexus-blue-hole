
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNeuronStore } from '../../../../store/useNeuronStore';
import { 
    DashboardLayout
} from '../../../../components/dashboard/NeuronDashboardComponents';
import { Plus } from 'lucide-react';
import dayjs from 'dayjs';

const ProjectsDashboard = () => {
    const { t } = useTranslation(['neuron', 'common']);
    const { projects } = useNeuronStore();
    const activeProjects = projects.filter(p => p.status === 'ACTIVE');
    const overdueProjects = projects.filter(p => new Date(p.endDate) < new Date() && p.status !== 'COMPLETED');
    const planningProjects = projects.filter(p => p.status === 'PLANNING');
    const completedProjects = projects.filter(p => p.status === 'COMPLETED');

    return (
        <DashboardLayout 
            titleKey="dashboard.projects.title"
            descriptionKey="dashboard.projects.description"
            actions={[
                { label: t('dashboard.projects.viewList', { ns: 'neuron' }), href: '/neuron/projects/list' },
                { label: t('dashboard.projects.newProject', { ns: 'neuron' }), icon: Plus, primary: true, href: '/neuron/projects/list' }
            ]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-card border border-border rounded-xl p-6 mb-4 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.projects.timelineGantt', { ns: 'neuron' })}</h2>
                        <div className="h-64 flex items-center justify-center bg-secondary/20 rounded border border-dashed border-border text-muted-foreground">
                            {/* Placeholder for complex gantt - Using simple timeline view */}
                            {projects.length > 0 ? (
                                <div className="w-full h-full p-4 space-y-4 overflow-y-auto">
                                    {projects.slice(0, 5).map(p => (
                                        <div key={p.id} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>{p.title}</span>
                                                <span>{dayjs(p.endDate).format('MM-DD')}</span>
                                            </div>
                                            <div className="h-2 w-full bg-secondary rounded-full">
                                                <div 
                                                    className="h-full bg-primary rounded-full opacity-70"
                                                    style={{ width: `${Math.random() * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : "No active projects"}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">{t('dashboard.projects.inProgress', { ns: 'neuron' })}</h3>
                            <div className="text-3xl font-bold text-blue-600">{activeProjects.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">This week +{projects.filter(p => dayjs(p.createdAt).isAfter(dayjs().subtract(7, 'day'))).length}</p>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">{t('dashboard.projects.overdue', { ns: 'neuron' })}</h3>
                            <div className="text-3xl font-bold text-red-600">{overdueProjects.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">{t('dashboard.projects.requiresAttention', { ns: 'neuron' })}</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.projects.statusBreakdown', { ns: 'neuron' })}</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span>{t('dashboard.projects.status.active', { ns: 'neuron' })}</span>
                                </div>
                                <span className="font-mono">{activeProjects.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span>{t('dashboard.projects.status.planning', { ns: 'neuron' })}</span>
                                </div>
                                <span className="font-mono">{planningProjects.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                    <span>{t('dashboard.projects.status.completed', { ns: 'neuron' })}</span>
                                </div>
                                <span className="font-mono">{completedProjects.length}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span>{t('dashboard.projects.overdue', { ns: 'neuron' })}</span>
                                </div>
                                <span className="font-mono">{overdueProjects.length}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.projects.resourceAllocation', { ns: 'neuron' })}</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span>{t('dashboard.projects.roles.development', { ns: 'neuron' })}</span>
                                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{ width: '80%' }}></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>{t('dashboard.projects.roles.design', { ns: 'neuron' })}</span>
                                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-pink-500" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>{t('dashboard.projects.roles.marketing', { ns: 'neuron' })}</span>
                                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProjectsDashboard;
