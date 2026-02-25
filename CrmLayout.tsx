
import React, { useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCrmStore } from '../../store/useCrmStore';
import { cn } from '../../lib/utils';
import { Users, BarChart3, Globe2, Plus } from 'lucide-react';

export const CrmLayout: React.FC = () => {
    const { t } = useTranslation(['work', 'common']);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { fetchLeads, fetchOpportunities, fetchPublicPool } = useCrmStore();

    useEffect(() => {
        fetchLeads();
        fetchOpportunities();
        fetchPublicPool();
    }, []);

    // Tabs configuration
    const tabs = [
        { path: 'leads', label: t('crm.tabs.leads'), icon: Users },
        { path: 'pipeline', label: t('crm.tabs.pipeline'), icon: BarChart3 },
        { path: 'public', label: t('crm.tabs.public'), icon: Globe2 },
    ];

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header / Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('crm.title')}</h1>
                    <p className="text-sm text-muted-foreground">{t('crm.description')}</p>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                        onClick={() => console.log('New Lead')}
                    >
                        <Plus className="w-4 h-4" />
                        {t('crm.newLead')}
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-border flex gap-6 px-2">
                {tabs.map(tab => (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-2 pb-3 border-b-2 text-sm font-medium transition-colors",
                            isActive 
                                ? "border-primary text-primary" 
                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </NavLink>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};
