
import React, { useEffect } from 'react';
import { useLeftBrainStore } from '../../../store/useLeftBrainStore';
import { formatCurrency } from '../../../lib/utils';
import { Eye, EyeOff, Trophy, TrendingUp, Wallet, Crown } from 'lucide-react';
import { SalaryCalculator } from '../components/finance/SalaryCalculator';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useTranslation } from 'react-i18next';

export const FinancePage: React.FC = () => {
    const { t } = useTranslation('work');
    const { 
        fetchFinanceData, 
        performanceHistory, 
        incentives, 
        isPrivacyMode, 
        togglePrivacyMode,
    } = useLeftBrainStore();

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const currentMonth = performanceHistory[performanceHistory.length - 1];
    
    // Privacy Mask
    const displayValue = (val: number | undefined) => {
        if (val === undefined) return '-';
        return isPrivacyMode ? '****' : formatCurrency(val);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('finance.title')}</h1>
                    <p className="text-muted-foreground">{t('finance.description')}</p>
                </div>
                <button 
                    onClick={togglePrivacyMode}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    title={isPrivacyMode ? "Show Values" : "Hide Values"}
                >
                    {isPrivacyMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                
                {/* 1. Quick Stats (Left Column) */}
                <div className="md:col-span-2 space-y-6">
                    {/* KPI Cards */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase mb-2">
                                <Wallet className="w-4 h-4" /> {t('finance.kpi.currentMonth')}
                            </div>
                            <div className="text-2xl font-bold text-primary">
                                {displayValue(currentMonth?.revenue)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{t('finance.kpi.revenueGenerated')}</div>
                        </div>
                        <div className="bg-card p-5 rounded-xl border border-border shadow-sm">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium uppercase mb-2">
                                <TrendingUp className="w-4 h-4" /> {t('finance.kpi.commissionEst')}
                            </div>
                            <div className="text-2xl font-bold text-emerald-600">
                                {displayValue(currentMonth?.commission)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{t('finance.kpi.pendingPayout')}</div>
                        </div>
                         <div className="bg-card p-5 rounded-xl border border-border shadow-sm bg-gradient-to-br from-purple-900/10 to-transparent">
                            <div className="flex items-center gap-2 text-purple-600 text-xs font-medium uppercase mb-2">
                                <Trophy className="w-4 h-4" /> {t('finance.kpi.activeContests')}
                            </div>
                            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                                {incentives.filter(i => i.status === 'ACTIVE').length}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{t('finance.kpi.joinToWin')}</div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                         <h3 className="font-semibold mb-6">{t('finance.charts.revenueCommission')}</h3>
                         <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={performanceHistory}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis hide={isPrivacyMode} stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                        formatter={(value: number) => isPrivacyMode ? '****' : formatCurrency(value)}
                                    />
                                    <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Revenue" />
                                    <Bar dataKey="commission" fill="#10b981" radius={[4, 4, 0, 0]} name="Commission" />
                                </BarChart>
                            </ResponsiveContainer>
                         </div>
                    </div>
                </div>

                {/* 2. Tools & Incentives (Right Column) */}
                <div className="space-y-6">
                    {/* Calculator */}
                    <SalaryCalculator />

                    {/* Incentive Board */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            {t('finance.incentives.title')}
                        </h3>
                        <div className="space-y-4">
                            {incentives.map(inc => (
                                <div key={inc.id} className="p-3 bg-secondary/30 rounded-lg border border-border/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-sm">{inc.title}</div>
                                        <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-medium border border-amber-500/20">
                                            {inc.type}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-3">{inc.reward}</div>
                                    
                                    {/* Participants Rank */}
                                    {inc.participants.length > 0 && (
                                        <div className="space-y-2 mt-2 pt-2 border-t border-border/50">
                                            {inc.participants.sort((a,b) => b.score - a.score).map((p, idx) => (
                                                <div key={p.name} className="flex justify-between items-center text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-4 h-4 flex items-center justify-center rounded-full ${idx === 0 ? 'bg-yellow-500 text-white' : 'bg-secondary text-muted-foreground'}`}>
                                                            {idx === 0 ? <Crown className="w-3 h-3" /> : idx + 1}
                                                        </span>
                                                        <span className={p.name === 'You' ? 'font-bold text-primary' : ''}>{p.name}</span>
                                                    </div>
                                                    <span className="font-mono">{formatCurrency(p.score).split('.')[0]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
