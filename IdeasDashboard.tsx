
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNeuronStore } from '../../../../store/useNeuronStore';
import { 
    DashboardLayout,
    StatCard, 
    QuickActionCard, 
    SectionHeader 
} from '../../../../components/dashboard/NeuronDashboardComponents';
import { Lightbulb, BrainCircuit, Target, Plus, Search, TrendingUp } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const IdeasDashboard = () => {
    const { t } = useTranslation(['neuron', 'common']);
    const { ideas, addIdea } = useNeuronStore();
    const navigate = useNavigate();

    const statusCounts = ideas.reduce((acc, i) => {
        acc[i.status] = (acc[i.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const data = [
        { name: t('dashboard.ideas.status.exploring', { ns: 'neuron' }), value: statusCounts['EXPLORING'] || 0, color: '#f59e0b' },
        { name: t('dashboard.ideas.status.validating', { ns: 'neuron' }), value: statusCounts['IN_PROGRESS'] || 0, color: '#3b82f6' },
        { name: t('dashboard.ideas.status.paused', { ns: 'neuron' }), value: statusCounts['PAUSED'] || 0, color: '#64748b' },
        { name: t('dashboard.ideas.status.completed', { ns: 'neuron' }), value: statusCounts['COMPLETED'] || 0, color: '#10b981' },
    ];

    const handleCreate = async () => {
        const content = prompt(t('dashboard.ideas.quickCapture', { ns: 'neuron' }));
        if (content) {
            await addIdea({ content, status: 'EXPLORING' });
        }
    };

    return (
        <DashboardLayout
            titleKey="dashboard.ideas.title"
            descriptionKey="dashboard.ideas.description"
            actions={[
                { label: t('view', { ns: 'common' }) + ' ' + t('list', { ns: 'common' }), href: '/neuron/ideas/list' },
                { label: t('create', { ns: 'common' }), icon: Plus, onClick: handleCreate, primary: true }
            ]}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard 
                    title={t('dashboard.ideas.totalIdeas', { ns: 'neuron' })} 
                    value={ideas.length} 
                    icon={Lightbulb} 
                    color="text-amber-500" 
                />
                <StatCard 
                    title={t('dashboard.ideas.inIncubation', { ns: 'neuron' })} 
                    value={statusCounts['EXPLORING'] || 0} 
                    icon={BrainCircuit} 
                    color="text-blue-500" 
                />
                <StatCard 
                    title={t('dashboard.ideas.realized', { ns: 'neuron' })} 
                    value={statusCounts['COMPLETED'] || 0} 
                    icon={Target} 
                    color="text-green-500" 
                    trend={{ value: 12, label: 'vs last month', positive: true }} 
                />
                <StatCard 
                    title={t('dashboard.ideas.conversionRate', { ns: 'neuron' })} 
                    value={`${ideas.length > 0 ? Math.round(((statusCounts['COMPLETED'] || 0) / ideas.length) * 100) : 0}%`} 
                    icon={TrendingUp} 
                    color="text-purple-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
                    <SectionHeader title={t('dashboard.ideas.pipelineStatus', { ns: 'neuron' })} />
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{t('dashboard.ideas.quickActions', { ns: 'neuron' })}</h3>
                    <QuickActionCard 
                        title={t('dashboard.ideas.quickCapture', { ns: 'neuron' })} 
                        description={t('dashboard.ideas.quickCaptureDesc', { ns: 'neuron' })} 
                        icon={Plus} 
                        onClick={handleCreate} 
                    />
                    <QuickActionCard 
                        title={t('dashboard.ideas.openMixer', { ns: 'neuron' })} 
                        description={t('dashboard.ideas.openMixerDesc', { ns: 'neuron' })} 
                        icon={BrainCircuit} 
                        onClick={() => navigate('/neuron/ideas/list')} 
                    />
                    <QuickActionCard 
                        title={t('dashboard.ideas.reviewPending', { ns: 'neuron' })} 
                        description={t('dashboard.ideas.reviewPendingDesc', { ns: 'neuron' })} 
                        icon={Search} 
                        onClick={() => navigate('/neuron/ideas/list')} 
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default IdeasDashboard;
