
import React, { useState, useEffect } from 'react';
import { useLeftBrainStore } from '../../../../store/useLeftBrainStore';
import { cn, formatCurrency } from '../../../../lib/utils';
import { Calculator, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SalaryCalculator: React.FC = () => {
    const { t } = useTranslation('work');
    const { salaryConfig, calculateExpectedSalary } = useLeftBrainStore();
    const [revenueInput, setRevenueInput] = useState<number>(0);

    useEffect(() => {
        // Default simulation value based on a reasonable target
        setRevenueInput(150000);
    }, []);

    if (!salaryConfig) return null;

    const expectedSalary = calculateExpectedSalary(revenueInput);
    const commission = revenueInput * salaryConfig.commissionRate;
    const fixedIncome = salaryConfig.baseSalary + salaryConfig.meritPayBase + salaryConfig.subsidy;

    return (
        <div className="bg-gradient-to-br from-card to-secondary/30 border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-primary">
                <Calculator className="w-5 h-5" />
                <h3 className="font-semibold">{t('finance.calculator.title')}</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        {t('finance.calculator.projectedRevenue')}
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">¥</span>
                        <input 
                            type="number"
                            value={revenueInput}
                            onChange={(e) => setRevenueInput(Number(e.target.value))}
                            className="w-full bg-background border border-input rounded-md py-2 pl-7 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('finance.calculator.fixedBase')}</span>
                        <span>{formatCurrency(fixedIncome)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('finance.calculator.commission')} ({(salaryConfig.commissionRate * 100).toFixed(0)}%)</span>
                        <span className="text-emerald-600 font-medium">+{formatCurrency(commission)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('finance.calculator.tax')} ({(salaryConfig.taxRate * 100).toFixed(0)}%)</span>
                        <span className="text-red-500 font-medium">-{formatCurrency((fixedIncome + commission) * salaryConfig.taxRate)}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-border mt-2">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-semibold text-foreground">{t('finance.calculator.netIncome')}</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(expectedSalary)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
