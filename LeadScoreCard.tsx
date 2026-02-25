
import React from 'react';
import { Lead } from '../../../types/crm';
import { cn } from '../../../lib/utils';
import { TrendingUp, AlertTriangle, Check, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LeadScoreCardProps {
    lead: Lead;
}

export const LeadScoreCard: React.FC<LeadScoreCardProps> = ({ lead }) => {
    const { t } = useTranslation('work');
    // Score Color Logic
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        if (score >= 50) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        if (score >= 30) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        return 'text-red-500 bg-red-500/10 border-red-500/20';
    };

    const scoreColorClass = getScoreColor(lead.score);

    return (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    {t('crm.scoreCard.healthScore')}
                </h3>
                <span className={cn("text-2xl font-bold font-mono px-3 py-1 rounded-lg border", scoreColorClass)}>
                    {lead.score}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                        className={cn("h-full transition-all duration-500", scoreColorClass.replace('bg-', 'bg-').split(' ')[0])} 
                        style={{ width: `${Math.min(100, lead.score)}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{t('crm.scoreCard.cold')} (0)</span>
                    <span>{t('crm.scoreCard.hot')} (100)</span>
                </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase">{t('crm.scoreCard.keyFactors')}</p>
                {lead.scoreBreakdown && lead.scoreBreakdown.length > 0 ? (
                    lead.scoreBreakdown.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-1.5">
                                {item.points > 0 ? <Check className="w-3 h-3 text-green-500" /> : <AlertTriangle className="w-3 h-3 text-red-500" />}
                                {item.rule}
                            </span>
                            <span className={item.points > 0 ? "text-green-600" : "text-red-600"}>
                                {item.points > 0 ? '+' : ''}{item.points}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-xs text-muted-foreground italic">{t('crm.scoreCard.noFactors')}</div>
                )}
            </div>

            {/* Stagnation Alert */}
            {(lead.stagnationDays || 0) > 7 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2 text-xs text-amber-600 flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <strong>{t('crm.scoreCard.stagnationAlert')}:</strong> {t('crm.scoreCard.stagnationMessage', { status: lead.status, days: lead.stagnationDays })}
                    </div>
                </div>
            )}
        </div>
    );
};
