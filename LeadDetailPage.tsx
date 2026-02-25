
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrmStore } from '../../../store/useCrmStore';
import { LeadScoreCard } from '../components/LeadScoreCard';
import { ClientTimeline } from '../components/ClientTimeline';
import { ArrowLeft, Mail, Phone, Calendar, Plus, Archive, MoreHorizontal, User, Building } from 'lucide-react';
import { formatDate, cn } from '../../../lib/utils';
import { InteractionType } from '../../../types/crm';
import { useTranslation } from 'react-i18next';

export const LeadDetailPage: React.FC = () => {
    const { t } = useTranslation(['work', 'common']);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchLeadDetails, activeLead, activeInteractions, isLoadingDetails, addInteraction, clearActiveLead } = useCrmStore();
    
    // Quick Interaction State
    const [isLogOpen, setIsLogOpen] = useState(false);
    const [logType, setLogType] = useState<InteractionType>('NOTE');
    const [logText, setLogText] = useState('');

    useEffect(() => {
        if (id) {
            fetchLeadDetails(id);
        }
        return () => clearActiveLead();
    }, [id]);

    const handleSubmitLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !logText.trim()) return;

        await addInteraction(id, {
            type: logType,
            summary: t('crm.detail.interactionLogged', { type: logType }),
            details: logText
        });
        
        setLogText('');
        setIsLogOpen(false);
    };

    if (isLoadingDetails) {
        return <div className="h-full flex items-center justify-center">{t('common:app.loading')}</div>;
    }

    if (!activeLead) {
        return <div className="p-8 text-center">{t('crm.leads.table.empty')}</div>;
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/work/crm/leads')}
                        className="p-2 rounded-full hover:bg-secondary text-muted-foreground"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">{activeLead.name}</h1>
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                {t(`crm.status.${activeLead.status}`)}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {activeLead.company}</span>
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {activeLead.email}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {activeLead.phone}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="p-2 border border-border rounded-lg hover:bg-secondary text-muted-foreground" title={t('crm.detail.archive')}>
                        <Archive className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-border rounded-lg hover:bg-secondary text-muted-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => { setIsLogOpen(true); }}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4" />
                        {t('crm.detail.logInteraction')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                
                {/* Left Column: Info & Score */}
                <div className="space-y-6 overflow-y-auto pr-2">
                    <LeadScoreCard lead={activeLead} />
                    
                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                        <h3 className="font-semibold text-sm mb-4">{t('crm.detail.details')}</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">{t('crm.detail.source')}</span>
                                <span className="font-medium">{activeLead.source}</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">{t('crm.detail.owner')}</span>
                                <span className="font-medium">You</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">{t('crm.detail.created')}</span>
                                <span className="font-medium">{formatDate(activeLead.createdAt)}</span>
                            </div>
                            <div className="flex justify-between border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">{t('crm.detail.lastContact')}</span>
                                <span className="font-medium">{activeLead.lastContact ? formatDate(activeLead.lastContact) : '-'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                        <h3 className="font-semibold text-sm mb-4">{t('crm.detail.tags')}</h3>
                        <div className="flex flex-wrap gap-2">
                            {activeLead.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                                    {tag}
                                </span>
                            ))}
                            <button className="px-2 py-1 border border-dashed border-border rounded text-xs text-muted-foreground hover:border-primary hover:text-primary">
                                + {t('crm.detail.addTag')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Timeline & Activity */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col min-h-0">
                    <h3 className="font-semibold text-lg mb-4">{t('crm.detail.activityTimeline')}</h3>
                    
                    {/* Quick Log Form */}
                    {isLogOpen && (
                        <div className="mb-6 p-4 bg-secondary/30 rounded-lg border border-border animate-in slide-in-from-top-2">
                            <div className="flex gap-2 mb-3">
                                {(['NOTE', 'CALL', 'EMAIL', 'MEETING'] as InteractionType[]).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setLogType(t)}
                                        className={cn(
                                            "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
                                            logType === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-secondary"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={logText}
                                onChange={e => setLogText(e.target.value)}
                                placeholder={t('crm.detail.logPlaceholder', { type: logType.toLowerCase() })}
                                className="w-full bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => setIsLogOpen(false)} className="px-3 py-1.5 text-xs font-medium hover:underline">{t('crm.detail.cancel')}</button>
                                <button onClick={handleSubmitLog} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90">{t('crm.detail.saveLog')}</button>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto pr-2">
                        <ClientTimeline interactions={activeInteractions} />
                    </div>
                </div>
            </div>
        </div>
    );
};
