
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNeuronStore } from '../../../../store/useNeuronStore';
import { 
    DashboardLayout,
    StatCard, 
    SectionHeader 
} from '../../../../components/dashboard/NeuronDashboardComponents';
import { Layers, Plus } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const DomainsDashboard = () => {
    const { t } = useTranslation(['neuron', 'common']);
    const { domains } = useNeuronStore();
    
    return (
        <DashboardLayout
            titleKey="dashboard.domains.title"
            descriptionKey="dashboard.domains.description"
            actions={[
                { label: t('dashboard.domains.exploreTree', { ns: 'neuron' }), href: '/neuron/domains/list' },
                { label: t('dashboard.domains.newDomain', { ns: 'neuron' }), icon: Plus, primary: true, onClick: () => {} }
            ]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-card border border-border rounded-xl p-6">
                    <SectionHeader title={t('dashboard.domains.expertiseDistribution', { ns: 'neuron' })} />
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={domains.map(d => ({ name: d.name, level: d.masteryLevel === 'EXPERT' ? 4 : d.masteryLevel === 'PROFICIENT' ? 3 : d.masteryLevel === 'COMPETENT' ? 2 : 1 }))}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis hide />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                                <Bar dataKey="level" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-4">
                    <StatCard 
                        title={t('dashboard.domains.totalDomains', { ns: 'neuron' })} 
                        value={domains.length} 
                        icon={Layers} 
                        color="text-purple-500" 
                    />
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h4 className="font-semibold mb-4">{t('dashboard.domains.topActiveDomains', { ns: 'neuron' })}</h4>
                        <div className="space-y-3">
                            {domains.slice(0, 3).map(d => (
                                <div key={d.id} className="flex justify-between items-center text-sm">
                                    <span>{d.name}</span>
                                    <span className="bg-secondary px-2 py-0.5 rounded text-xs">{d.masteryLevel}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DomainsDashboard;
