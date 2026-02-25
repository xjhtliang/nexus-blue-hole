
import React, { useEffect, useState } from 'react';
import { useNeuronStore } from '../../../store/useNeuronStore';
import { IdeaBoard } from '../../../modules/neuron/ideas/components/IdeaBoard';
import { IdeaCapture } from '../../../modules/neuron/ideas/components/IdeaCapture';
import { IdeaDetail } from '../../../modules/neuron/ideas/components/IdeaDetail';
import { IdeaIncubator } from '../../../modules/neuron/ideas/components/IdeaIncubator';
import { IdeaTimeline } from '../../../modules/neuron/ideas/components/IdeaTimeline';
import { IdeaNetwork } from '../../../modules/neuron/ideas/components/IdeaNetwork';
import { Lightbulb, History, FlaskConical, Kanban, Calendar, Network, Filter, Loader2, ArrowDown } from 'lucide-react';
import { Idea } from '../../../types/neuron';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';

export const IdeasPage: React.FC = () => {
    const { fetchIdeas, ideas, loadMoreIdeas, ideasPagination, isLoadingIdeas } = useNeuronStore();
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
    const [viewMode, setViewMode] = useState('board');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchIdeas();
    }, []);

    const filteredIdeas = ideas.filter(i => 
        i.content.toLowerCase().includes(filter.toLowerCase()) || 
        i.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
    );

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Lightbulb className="w-6 h-6 text-amber-500" />
                        Idea Incubator
                    </h1>
                    <p className="text-muted-foreground">Capture, nurture, and realize your thoughts.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-secondary">
                        <History className="w-4 h-4" /> Archive
                    </button>
                </div>
            </div>

            {/* View Tabs */}
            <Tabs value={viewMode} onValueChange={setViewMode} className="flex-1 flex flex-col min-h-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="w-full max-w-xl">
                        <IdeaCapture />
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-48">
                            <Filter className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                            <input 
                                type="text" 
                                placeholder="Filter ideas..." 
                                className="w-full h-9 pl-8 pr-3 rounded-md border border-input bg-background text-sm"
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                            />
                        </div>
                        <TabsList className="bg-card border border-border p-1 rounded-lg flex items-center shrink-0">
                            <TabsTrigger value="board" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary" title="Board">
                                <Kanban className="w-4 h-4" />
                            </TabsTrigger>
                            <TabsTrigger value="timeline" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary" title="Timeline">
                                <Calendar className="w-4 h-4" />
                            </TabsTrigger>
                            <TabsTrigger value="network" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary" title="Network">
                                <Network className="w-4 h-4" />
                            </TabsTrigger>
                            <TabsTrigger value="mixer" className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary" title="Mixer">
                                <FlaskConical className="w-4 h-4" />
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                <div className="flex-1 min-h-0 bg-background/50 rounded-xl border border-border/50 p-1 flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <TabsContent value="board" className="h-full m-0 outline-none">
                            <IdeaBoard onIdeaClick={setSelectedIdea} />
                        </TabsContent>
                        
                        <TabsContent value="timeline" className="h-full m-0 outline-none p-4">
                            <IdeaTimeline ideas={filteredIdeas} onIdeaClick={setSelectedIdea} />
                        </TabsContent>

                        <TabsContent value="network" className="h-full m-0 outline-none p-4">
                            <IdeaNetwork ideas={filteredIdeas} onIdeaClick={setSelectedIdea} />
                        </TabsContent>
                        
                        <TabsContent value="mixer" className="h-full m-0 outline-none">
                            <IdeaIncubator />
                        </TabsContent>
                    </div>

                    {/* Pagination Trigger */}
                    {ideasPagination.hasMore && !filter && (
                        <div className="p-2 border-t border-border flex justify-center">
                            <button 
                                onClick={() => loadMoreIdeas()}
                                disabled={isLoadingIdeas}
                                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 disabled:opacity-50"
                            >
                                {isLoadingIdeas ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowDown className="w-3 h-3" />}
                                Load More Ideas ({ideas.length} / {ideasPagination.total})
                            </button>
                        </div>
                    )}
                </div>
            </Tabs>

            {/* Detail Modal */}
            <IdeaDetail 
                idea={selectedIdea} 
                onClose={() => setSelectedIdea(null)} 
            />
        </div>
    );
};
