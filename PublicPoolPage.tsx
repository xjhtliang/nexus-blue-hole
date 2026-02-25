
import React from 'react';
import { useCrmStore } from '../../../store/useCrmStore';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PublicPoolPage: React.FC = () => {
    const { t } = useTranslation(['work', 'common']);
    const { publicLeads, claimLead, isLoading } = useCrmStore();

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-2">
                <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-1">{t('crm.publicPool.title')}</h3>
                <p className="text-sm text-muted-foreground">
                    {t('crm.publicPool.description')}
                </p>
            </div>

             <div className="flex-1 overflow-auto">
                 {isLoading ? (
                     <div className="p-8 text-center text-sm">{t('common:app.loading')}</div>
                 ) : (
                     <div className="bg-card border border-border rounded-md">
                        {publicLeads.map(lead => (
                            <div key={lead.id} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-secondary/50">
                                <div>
                                    <div className="font-medium">{lead.name}</div>
                                    <div className="text-xs text-muted-foreground">{lead.company} • {lead.source}</div>
                                </div>
                                <button 
                                    onClick={() => claimLead(lead.id)}
                                    className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 flex items-center gap-1 transition-colors"
                                >
                                    <Download className="w-3 h-3" />
                                    {t('crm.publicPool.claim')}
                                </button>
                            </div>
                        ))}
                        {publicLeads.length === 0 && <div className="p-8 text-center text-muted-foreground">{t('crm.publicPool.empty')}</div>}
                     </div>
                 )}
             </div>
        </div>
    );
};
