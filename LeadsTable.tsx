
import React, { useState } from 'react';
import { Lead } from '../../../types/crm';
import { formatRelativeTime } from '../../../lib/utils';
import { MoreHorizontal, Phone, Mail, Tag, Star, Archive } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LeadsTableProps {
    data: Lead[];
    onRowClick?: (lead: Lead) => void;
    onArchive?: (lead: Lead) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
    const { t } = useTranslation('work');
    const colors: Record<string, string> = {
        NEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        CONTACTED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        QUALIFIED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        LOST: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 dark:bg-gray-800'}`}>
            {t(`crm.status.${status}`)}
        </span>
    );
};

export const LeadsTable: React.FC<LeadsTableProps> = ({ data, onRowClick, onArchive }) => {
    const { t } = useTranslation('work');
    const navigate = useNavigate();

    const handleRowClick = (lead: Lead) => {
        if (onRowClick) {
            onRowClick(lead);
        } else {
            navigate(`/work/crm/leads/${lead.id}`);
        }
    };

    if (data.length === 0) {
        return <div className="p-8 text-center text-muted-foreground">{t('crm.leads.table.empty')}</div>
    }

    return (
        <div className="rounded-md border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                        <tr>
                            <th className="px-6 py-3 font-medium">{t('crm.leads.table.nameCompany')}</th>
                            <th className="px-6 py-3 font-medium">{t('crm.leads.table.status')}</th>
                            <th className="px-6 py-3 font-medium">{t('crm.leads.table.score')}</th>
                            <th className="px-6 py-3 font-medium">{t('crm.leads.table.contact')}</th>
                            <th className="px-6 py-3 font-medium">{t('crm.leads.table.lastContact')}</th>
                            <th className="px-6 py-3 font-medium">{t('crm.leads.table.tags')}</th>
                            <th className="px-6 py-3 font-medium text-right">{t('crm.leads.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.map((lead) => (
                            <tr 
                                key={lead.id} 
                                className="bg-background hover:bg-secondary/50 transition-colors cursor-pointer group"
                                onClick={() => handleRowClick(lead)}
                            >
                                <td className="px-6 py-4">
                                    <div className="font-medium text-foreground">{lead.name}</div>
                                    <div className="text-xs text-muted-foreground">{lead.company}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={lead.status} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <Star className={`w-3 h-3 ${lead.score > 50 ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                                        <span>{lead.score}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {lead.phone && <Phone className="w-4 h-4 text-muted-foreground hover:text-primary" />}
                                        {lead.email && <Mail className="w-4 h-4 text-muted-foreground hover:text-primary" />}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {lead.lastContact ? formatRelativeTime(lead.lastContact) : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1 flex-wrap">
                                        {lead.tags.map(tag => (
                                            <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-secondary text-secondary-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => { e.stopPropagation(); onArchive?.(lead); }}
                                            title={t('crm.detail.archive')}
                                        >
                                            <Archive className="w-4 h-4" />
                                        </button>
                                        <button className="p-1 hover:bg-secondary rounded">
                                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
