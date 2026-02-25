
import React, { useEffect, useState } from 'react';
import { useNeuronStore } from '../../../store/useNeuronStore';
import { DomainTree } from '../../../modules/neuron/domains/components/DomainTree';
import { DomainDetail } from '../../../modules/neuron/domains/components/DomainDetail';
import { DomainGraph } from '../../../modules/neuron/domains/components/DomainGraph';
import { SkillMatrix } from '../../../modules/neuron/domains/components/SkillMatrix';
import { Domain } from '../../../types/neuron';
import { Layers, Plus, Network, Radar, ListTree } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';

export const DomainsPage: React.FC = () => {
    const { domains, fetchDomains, addDomain, isLoadingDomains } = useNeuronStore();
    const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
    const [viewMode, setViewMode] = useState('explorer');

    useEffect(() => {
        fetchDomains();
    }, []);

    const handleCreateDomain = () => {
        const name = prompt("Enter domain name:");
        if (name) {
            addDomain({ name, importance: 3 });
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Layers className="w-6 h-6 text-primary" />
                        Knowledge Domains
                    </h1>
                    <p className="text-muted-foreground">Map your expertise and learning goals.</p>
                </div>
                <button 
                    onClick={handleCreateDomain}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                >
                    <Plus className="w-4 h-4" />
                    New Domain
                </button>
            </div>

            <Tabs value={viewMode} onValueChange={setViewMode} className="flex-1 flex flex-col min-h-0">
                <div className="flex justify-end mb-4">
                    <TabsList className="bg-card border border-border p-1 rounded-lg flex items-center">
                        <TabsTrigger value="explorer" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary">
                            <ListTree className="w-4 h-4" /> Explorer
                        </TabsTrigger>
                        <TabsTrigger value="graph" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary">
                            <Network className="w-4 h-4" /> Graph
                        </TabsTrigger>
                        <TabsTrigger value="matrix" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary">
                            <Radar className="w-4 h-4" /> Skill Matrix
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 min-h-0">
                    <TabsContent value="explorer" className="h-full m-0 outline-none">
                        <div className="grid grid-cols-12 gap-6 h-full">
                            <div className="col-span-4 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-border bg-secondary/10">
                                    <h3 className="font-semibold text-sm">Structure</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto p-2">
                                    {isLoadingDomains ? (
                                        <div className="p-4 text-center text-muted-foreground">Loading...</div>
                                    ) : (
                                        <DomainTree domains={domains} onSelect={setSelectedDomain} />
                                    )}
                                </div>
                            </div>
                            <div className="col-span-8 min-h-0">
                                <DomainDetail domain={selectedDomain} />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="graph" className="h-full m-0 outline-none">
                        <DomainGraph domains={domains} onSelect={setSelectedDomain} />
                    </TabsContent>

                    <TabsContent value="matrix" className="h-full m-0 outline-none bg-card border border-border rounded-xl">
                        <SkillMatrix domains={domains} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};
