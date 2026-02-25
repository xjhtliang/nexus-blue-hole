import React from 'react';
import { Resource } from '../../../../../types/neuron';
import { User, HeartHandshake, Calendar, MessageSquare } from 'lucide-react';
import { formatDate } from '../../../../../lib/utils';

interface HelpTrackerProps {
    resources: Resource[];
}

export const HelpTracker: React.FC<HelpTrackerProps> = ({ resources }) => {
    const helpItems = resources.filter(r => r.type === 'PERSON_HELP');

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4 bg-purple-500/10 p-3 rounded-lg border border-purple-500/20 text-purple-700 dark:text-purple-300">
                <HeartHandshake className="w-5 h-5" />
                <div>
                    <h3 className="font-semibold text-sm">Gratitude Log</h3>
                    <p className="text-xs opacity-80">Track help received from colleagues to build stronger relationships.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {helpItems.map(item => (
                    <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex gap-4 hover:shadow-sm transition-shadow">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-muted-foreground">
                                <User className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold">{item.metadata?.helperName || 'Colleague'}</h4>
                                    <p className="text-sm text-muted-foreground">{item.title}</p>
                                </div>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {item.metadata?.helpDate ? formatDate(item.metadata.helpDate) : 'Unknown Date'}
                                </span>
                            </div>
                            
                            <p className="text-sm mt-2 bg-secondary/30 p-2 rounded-md border border-border/50">
                                {item.description}
                            </p>

                            <div className="flex items-center gap-2 mt-3 text-xs">
                                {item.tags.map(tag => (
                                    <span key={tag} className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                                {item.metadata?.helpContext && (
                                    <span className="text-muted-foreground flex items-center gap-1 border-l border-border pl-2">
                                        <MessageSquare className="w-3 h-3" />
                                        {item.metadata.helpContext}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                
                {helpItems.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                        No help records found. Add a "Person Help" resource to start tracking.
                    </div>
                )}
            </div>
        </div>
    );
};
