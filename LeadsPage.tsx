
import React from 'react';
import { useCrmStore } from '../../../store/useCrmStore';
import { LeadsTable } from '../components/LeadsTable';
import { Search, Filter } from 'lucide-react';
import { Lead } from '../../../types/crm';
import { useTranslation } from 'react-i18next';

export const LeadsPage: React.FC = () => {
    const { t } = useTranslation(['work', 'common']);
    const { leads, isLoading, archiveLead } = useCrmStore();
    const [filter, setFilter] = React.useState('');

    const filteredLeads = leads.filter(l => 
        l.name.toLowerCase().includes(filter.toLowerCase()) || 
        l.company.toLowerCase().includes(filter.toLowerCase())
    );

    const handleArchiveLead = async (lead: Lead) => {
        if (confirm(t('crm.leads.archiveConfirm', { name: lead.name }))) {
            await archiveLead(lead.id);
            // Optional: Show toast
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4">
             <div className="flex gap-2 mb-2">
                 <div className="relative flex-1 max-w-md">
                     <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                     <input 
                        type="text" 
                        placeholder={t('crm.leads.filterPlaceholder')}
                        className="w-full bg-card border border-input rounded-lg pl-9 pr-4 py-2 text-sm"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                     />
                 </div>
                 <button className="p-2 border border-input rounded-lg bg-card hover:bg-secondary">
                     <Filter className="w-4 h-4 text-muted-foreground" />
                 </button>
             </div>

             <div className="flex-1 overflow-auto">
                 {isLoading ? (
                     <div className="p-8 text-center text-sm">{t('common:app.loading')}</div>
                 ) : (
                     <LeadsTable 
                        data={filteredLeads} 
                        onArchive={handleArchiveLead}
                     />
                 )}
             </div>
        </div>
    );
};
