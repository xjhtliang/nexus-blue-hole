import React from 'react';
import { Resource } from '../../../../../types/neuron';
import { Bot, ExternalLink, Tag, Cpu } from 'lucide-react';

interface AiToolCatalogProps {
    resources: Resource[];
}

export const AiToolCatalog: React.FC<AiToolCatalogProps> = ({ resources }) => {
    const aiTools = resources.filter(r => r.type === 'AI_TOOL');

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                <Cpu className="w-5 h-5" />
                <div>
                    <h3 className="font-semibold text-sm">AI Toolset</h3>
                    <p className="text-xs opacity-80">Curated collection of AI tools for productivity and creation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiTools.map(tool => (
                    <div key={tool.id} className="group bg-card border border-border rounded-xl p-4 hover:border-emerald-500/50 transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-2">
                            <div className="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg">
                                <Bot className="w-5 h-5" />
                            </div>
                            <a 
                                href={tool.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                        
                        <h4 className="font-semibold mb-1">{tool.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 h-8">
                            {tool.description}
                        </p>

                        <div className="space-y-2">
                            {tool.metadata?.aiModel && (
                                <div className="flex items-center justify-between text-xs bg-secondary px-2 py-1 rounded">
                                    <span className="text-muted-foreground">Model</span>
                                    <span className="font-medium">{tool.metadata.aiModel}</span>
                                </div>
                            )}
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                                {tool.tags.map(tag => (
                                    <span key={tag} className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {aiTools.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                        No AI tools added yet.
                    </div>
                )}
            </div>
        </div>
    );
};
