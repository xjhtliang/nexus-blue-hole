
import React, { useEffect } from 'react';
import { useRightBrainStore } from '../../../store/useRightBrainStore';
import { formatCurrency, formatDate } from '../../../lib/utils';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const LifeFinancePage: React.FC = () => {
    const { t } = useTranslation('life');
    const { transactions, fetchDashboardData } = useRightBrainStore();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">{t('finance.title')}</h1>
                <span className="text-sm text-muted-foreground">{t('finance.subtitle')}</span>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                 <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
                    <div className="text-xs text-muted-foreground uppercase font-medium mb-1">{t('finance.balance')}</div>
                    <div className="text-2xl font-bold text-foreground">{formatCurrency(balance)}</div>
                 </div>
                 <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex justify-between items-center">
                    <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">{t('finance.income')}</div>
                        <div className="text-2xl font-bold text-emerald-500">{formatCurrency(totalIncome)}</div>
                    </div>
                    <ArrowUpCircle className="w-8 h-8 text-emerald-500/20" />
                 </div>
                 <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex justify-between items-center">
                    <div>
                        <div className="text-xs text-muted-foreground uppercase font-medium mb-1">{t('finance.expense')}</div>
                        <div className="text-2xl font-bold text-red-500">{formatCurrency(totalExpense)}</div>
                    </div>
                    <ArrowDownCircle className="w-8 h-8 text-red-500/20" />
                 </div>
            </div>

            {/* Transactions List */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-semibold">{t('finance.recentTransactions')}</h3>
                    <button className="text-xs text-primary hover:underline">{t('finance.viewAll')}</button>
                </div>
                <div className="divide-y divide-border">
                    {transactions.map(t => (
                        <div key={t.id} className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {t.type === 'INCOME' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <div className="font-medium text-sm">{t.description}</div>
                                    <div className="text-xs text-muted-foreground">{t.category} • {formatDate(t.date)}</div>
                                </div>
                            </div>
                            <div className={`font-mono font-medium ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'}`}>
                                {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && <div className="p-6 text-center text-muted-foreground">{t('finance.noTransactions')}</div>}
                </div>
            </div>
        </div>
    );
};
