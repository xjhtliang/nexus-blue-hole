
import React from 'react';
import { GlobalGraphPage } from '../GlobalGraphPage';
import { DashboardLayout, StatCard } from '../../../../components/dashboard/NeuronDashboardComponents';
import { useNeuronStore } from '../../../../store/useNeuronStore';
import { BrainCircuit, GitBranch, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const GraphDashboard: React.FC = () => {
    const { t } = useTranslation(['neuron', 'common']);
    const { ideas, domains, notes } = useNeuronStore();
    const totalNodes = ideas.length + domains.length + notes.length;
    // Rough estimate of edges
    const totalEdges = ideas.reduce((acc, i) => acc + i.linkedEntityIds.length, 0) + domains.reduce((acc, d) => acc + d.relatedDomainIds.length, 0);

    return (
        <DashboardLayout 
            titleKey="dashboard.connections.title"
            descriptionKey="dashboard.connections.description"
            actions={[
                { label: t('view', { ns: 'common' }), href: '/neuron/connections/view', primary: true }
            ]}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    title={t('dashboard.connections.totalNodes', { ns: 'neuron' })} 
                    value={totalNodes} 
                    icon={BrainCircuit} 
                    color="text-purple-500" 
                />
                <StatCard 
                    title={t('dashboard.connections.totalConnections', { ns: 'neuron' })} 
                    value={totalEdges} 
                    icon={Share2} 
                    color="text-blue-500" 
                />
                <StatCard 
                    title={t('dashboard.connections.density', { ns: 'neuron' })} 
                    value={(totalEdges / (totalNodes || 1)).toFixed(2)} 
                    icon={GitBranch} 
                    color="text-emerald-500" 
                />
            </div>

            <div className="flex-1 min-h-[500px] border border-border rounded-xl overflow-hidden shadow-sm relative mt-6">
                <GlobalGraphPage />
                <div className="absolute inset-0 bg-background/10 pointer-events-none border-2 border-primary/20 rounded-xl" />
            </div>
        </DashboardLayout>
    );
};
