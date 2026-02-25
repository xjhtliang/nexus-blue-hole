
import React, { useEffect, useState } from 'react';
import { useNeuronStore } from '../../../store/useNeuronStore';
import { GlobalGraph } from '../../../modules/neuron/analytics/GlobalGraph';
import { GraphInsights } from '../../../modules/neuron/analytics/GraphInsights';
import { BrainCircuit, SidebarOpen } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const GlobalGraphPage: React.FC = () => {
    const { fetchDomains, fetchIdeas, fetchProjects, fetchTasks } = useNeuronStore();
    const [showInsights, setShowInsights] = useState(true);

    useEffect(() => {
        fetchDomains();
        fetchIdeas();
        fetchProjects();
        fetchTasks();
    }, []);

    return (
        <div className="h-full flex flex-col space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6 text-indigo-500" />
                        Global Synapse Graph
                    </h1>
                    <p className="text-muted-foreground">Visualize the connections between your life, work, and ideas.</p>
                </div>
                <button 
                    onClick={() => setShowInsights(!showInsights)}
                    className={cn(
                        "p-2 rounded-lg border transition-all",
                        showInsights ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:bg-secondary"
                    )}
                    title="Toggle AI Insights"
                >
                    <SidebarOpen className="w-5 h-5 transform rotate-180" />
                </button>
            </div>
            
            <div className="flex-1 min-h-0 relative rounded-xl overflow-hidden">
                <GlobalGraph />
                
                {/* Overlay Insights */}
                {showInsights && <GraphInsights />}
            </div>
        </div>
    );
};
