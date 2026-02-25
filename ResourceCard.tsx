import React from 'react';
import { Resource } from '../../../../types/neuron';
import { FileText, Link as LinkIcon, User, Wrench, Image as ImageIcon, ExternalLink, Star } from 'lucide-react';
import { cn, formatDate } from '../../../../lib/utils';

interface ResourceCardProps {
    resource: Resource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
    const getIcon = () => {
        switch (resource.type) {
            case 'LINK': return <LinkIcon className="w-5 h-5 text-blue-500" />;
            case 'FILE': return <FileText className="w-5 h-5 text-orange-500" />;
            case 'PERSON_HELP': return <User className="w-5 h-5 text-purple-500" />;
            case 'AI_TOOL': return <Wrench className="w-5 h-5 text-green-500" />;
            case 'DESIGN_ASSET': return <ImageIcon className="w-5 h-5 text-pink-500" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const getTypeLabel = () => {
        switch (resource.type) {
            case 'PERSON_HELP': return 'Colleague Help';
            case 'AI_TOOL': return 'AI Tool';
            case 'DESIGN_ASSET': return 'Asset';
            default: return resource.type;
        }
    };

    return (
        <div className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow group flex flex-col h-full">
            <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-secondary rounded-lg">
                    {getIcon()}
                </div>
                <div className="flex items-center gap-1">
                    {resource.rating && (
                        <div className="flex items-center text-xs font-medium text-yellow-500">
                            <Star className="w-3 h-3 fill-yellow-500 mr-0.5" />
                            {resource.rating}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1">
                <h3 className="font-semibold text-sm line-clamp-1 mb-1">{resource.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {resource.description || 'No description provided.'}
                </p>
                
                {resource.metadata?.helperName && (
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-2">
                        Helper: {resource.metadata.helperName}
                    </div>
                )}
                
                {resource.metadata?.aiModel && (
                    <div className="text-xs text-green-600 dark:text-green-400 mb-2">
                        Model: {resource.metadata.aiModel}
                    </div>
                )}
            </div>

            <div className="pt-3 border-t border-border mt-auto flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                    {resource.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                            {tag}
                        </span>
                    ))}
                </div>
                
                {resource.url && (
                    <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center text-xs"
                    >
                        Visit <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                )}
                
                {resource.type === 'PERSON_HELP' && (
                    <span className="text-[10px] text-muted-foreground">
                        {formatDate(resource.createdAt)}
                    </span>
                )}
            </div>
        </div>
    );
};
