
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNeuronStore } from '../../../../store/useNeuronStore';
import { 
    DashboardLayout
} from '../../../../components/dashboard/NeuronDashboardComponents';
import { Briefcase, Activity, Layers, Plus } from 'lucide-react';
import { 
    PieChart, Pie, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const ResourcesDashboard = () => {
    const { t } = useTranslation(['neuron', 'common']);
    const { resources } = useNeuronStore();
    
    // Categorize
    const counts = {
        LIFE: resources.filter(r => r.category === 'LIFE').length,
        WORK: resources.filter(r => r.category === 'WORK').length,
        TOOL: resources.filter(r => r.category === 'TOOL' || r.type === 'AI_TOOL').length,
    };
    
    // Top Tags
    const tagCounts: Record<string, number> = {};
    resources.forEach(r => r.tags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1));
    const topTags = Object.entries(tagCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);

    const chartData = [
        { name: t('dashboard.resources.work', { ns: 'neuron' }), value: counts.WORK, color: '#3b82f6' },
        { name: t('dashboard.resources.life', { ns: 'neuron' }), value: counts.LIFE, color: '#10b981' },
        { name: t('dashboard.resources.tools', { ns: 'neuron' }), value: counts.TOOL, color: '#f59e0b' },
    ];

    return (
        <DashboardLayout
            titleKey="dashboard.resources.title"
            descriptionKey="dashboard.resources.description"
            actions={[
                { label: t('dashboard.resources.browseLibrary', { ns: 'neuron' }), href: '/neuron/resources/list' },
                { label: t('dashboard.resources.addResource', { ns: 'neuron' }), icon: Plus, primary: true, href: '/neuron/resources/list' }
            ]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.resources.categoryDistribution', { ns: 'neuron' })}</h2>
                        <div className="h-64 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={chartData} 
                                        dataKey="value" 
                                        nameKey="name" 
                                        cx="50%" 
                                        cy="50%" 
                                        outerRadius={80} 
                                        innerRadius={40}
                                        label
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.resources.overview', { ns: 'neuron' })}</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-500" /> {t('dashboard.resources.work', { ns: 'neuron' })}</span>
                                <span className="font-bold">{counts.WORK}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-green-500" /> {t('dashboard.resources.life', { ns: 'neuron' })}</span>
                                <span className="font-bold">{counts.LIFE}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                                <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-amber-500" /> {t('dashboard.resources.tools', { ns: 'neuron' })}</span>
                                <span className="font-bold">{counts.TOOL}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="font-medium">{t('dashboard.resources.totalItems', { ns: 'neuron' })}</span>
                                <span className="font-bold text-lg">{resources.length}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.resources.popularTags', { ns: 'neuron' })}</h2>
                        <div className="space-y-3">
                            {topTags.map(([tag, count]) => (
                                <div key={tag} className="flex justify-between items-center text-sm">
                                    <span className="truncate flex-1">{tag}</span>
                                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{count}</span>
                                </div>
                            ))}
                            {topTags.length === 0 && <div className="text-muted-foreground text-xs">No tags yet.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ResourcesDashboard;
