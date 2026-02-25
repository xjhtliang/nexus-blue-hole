
import React from 'react';
import { Interaction } from '../../../types/crm';
import { formatDate } from '../../../lib/utils';
import { Mail, Phone, Users, FileText, AlertCircle, CheckSquare } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useTranslation } from 'react-i18next';

interface ClientTimelineProps {
    interactions: Interaction[];
}

export const ClientTimeline: React.FC<ClientTimelineProps> = ({ interactions }) => {
    const { t } = useTranslation('work');
    const getIcon = (type: string) => {
        switch (type) {
            case 'EMAIL': return <Mail className="w-4 h-4" />;
            case 'CALL': return <Phone className="w-4 h-4" />;
            case 'MEETING': return <Users className="w-4 h-4" />;
            case 'NOTE': return <FileText className="w-4 h-4" />;
            case 'SYSTEM_ALERT': return <AlertCircle className="w-4 h-4" />;
            case 'TASK_COMPLETE': return <CheckSquare className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case 'EMAIL': return 'bg-blue-500 text-white';
            case 'CALL': return 'bg-purple-500 text-white';
            case 'MEETING': return 'bg-orange-500 text-white';
            case 'SYSTEM_ALERT': return 'bg-red-500 text-white';
            default: return 'bg-secondary text-muted-foreground';
        }
    };

    if (interactions.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground bg-card border border-border rounded-xl border-dashed">
                <p>{t('crm.timeline.empty')}</p>
                <p className="text-xs">{t('crm.timeline.emptyHint')}</p>
            </div>
        );
    }

    return (
        <div className="relative pl-6 border-l border-border space-y-8 py-2">
            {interactions.map((item) => (
                <div key={item.id} className="relative group">
                    {/* Dot */}
                    <div className={cn(
                        "absolute -left-[33px] w-8 h-8 rounded-full border-4 border-background flex items-center justify-center shadow-sm",
                        getColors(item.type)
                    )}>
                        {getIcon(item.type)}
                    </div>

                    {/* Card */}
                    <div className="bg-card border border-border rounded-lg p-4 shadow-sm group-hover:shadow-md transition-shadow relative">
                         {/* Triangle */}
                         <div className="absolute top-4 -left-1.5 w-3 h-3 bg-card border-l border-b border-border rotate-45 transform" />

                         <div className="flex justify-between items-start mb-1">
                             <div className="font-semibold text-sm">{item.summary}</div>
                             <div className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(item.date)}</div>
                         </div>
                         
                         {item.details && (
                             <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{item.details}</p>
                         )}

                         <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                             <span>{t('crm.timeline.by')} {item.performedBy}</span>
                             {item.outcome && (
                                 <>
                                    <span>•</span>
                                    <span className="font-medium text-foreground">{t('crm.timeline.outcome')}: {item.outcome}</span>
                                 </>
                             )}
                         </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
