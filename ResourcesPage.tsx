import React, { useEffect, useState } from 'react';
import { useNeuronStore } from '../../../store/useNeuronStore';
import { ResourceCard } from '../components/resources/ResourceCard';
import { HelpTracker } from '../components/resources/work/HelpTracker';
import { AiToolCatalog } from '../components/resources/tools/AiToolCatalog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { Search, Plus, Filter, Briefcase, Heart, Cpu, Users, Bot } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ResourcesPage: React.FC = () => {
    const { resources, fetchResources, isLoadingResources } = useNeuronStore();
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<string>('ALL');

    useEffect(() => {
        fetchResources();
    }, []);

    const filteredResources = resources.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                              r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
        
        if (activeTab === 'ALL') return matchesSearch;
        if (activeTab === 'HELP') return matchesSearch && r.type === 'PERSON_HELP';
        if (activeTab === 'AI') return matchesSearch && r.type === 'AI_TOOL';
        
        return matchesSearch && r.category === activeTab;
    });

    const categories = [
        { id: 'ALL', label: 'All', icon: Filter },
        { id: 'WORK', label: 'Work', icon: Briefcase },
        { id: 'LIFE', label: 'Life', icon: Heart },
        { id: 'TOOL', label: 'Tools', icon: Cpu },
        { id: 'HELP', label: 'People', icon: Users }, // Specialized View
        { id: 'AI', label: 'AI Hub', icon: Bot },     // Specialized View
    ];

    const renderContent = () => {
        if (isLoadingResources) {
            return <div className="p-8 text-center text-muted-foreground">Loading resources...</div>;
        }

        if (activeTab === 'HELP') {
            return <HelpTracker resources={resources} />; // Pass full list, component filters logic helps if we move logic there, but here we pass full and let it filter or we pass filtered. Let's pass filteredResources if it matches type, but simpler to pass full store data if component handles it. Actually filteredResources is already filtered by type above. Let's pass filteredResources.
        }

        if (activeTab === 'AI') {
            return <AiToolCatalog resources={resources} />;
        }

        if (filteredResources.length === 0) {
            return (
                <div className="p-12 text-center border-2 border-dashed border-border rounded-xl text-muted-foreground">
                    No resources found matching your criteria.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredResources.map(res => (
                    <ResourceCard key={res.id} resource={res} />
                ))}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Resource Library</h1>
                    <p className="text-muted-foreground">Knowledge base, tools, and assets.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    <Plus className="w-4 h-4" />
                    Add Resource
                </button>
            </div>

            <div className="flex gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input 
                        type="text"
                        placeholder="Search resources..."
                        className="w-full bg-card border border-input rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="flex bg-card border border-border p-1 rounded-lg">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                                activeTab === cat.id 
                                    ? "bg-primary text-primary-foreground shadow-sm" 
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <cat.icon className="w-3 h-3" />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
                {activeTab === 'HELP' ? <HelpTracker resources={resources} /> :
                 activeTab === 'AI' ? <AiToolCatalog resources={resources} /> :
                 renderContent()}
            </div>
        </div>
    );
};
