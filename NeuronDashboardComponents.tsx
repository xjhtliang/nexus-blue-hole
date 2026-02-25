
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

interface DashboardHeaderProps {
    title: string;
    description: string;
    actions?: {
        label: string;
        icon?: React.ElementType;
        onClick?: () => void;
        href?: string;
        primary?: boolean;
    }[];
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, description, actions }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                <p className="text-muted-foreground mt-1">{description}</p>
            </div>
            {actions && (
                <div className="flex items-center gap-2">
                    {actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => action.href ? navigate(action.href) : action.onClick?.()}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                action.primary 
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" 
                                    : "bg-card border border-border hover:bg-secondary text-foreground"
                            )}
                        >
                            {action.icon && <action.icon className="w-4 h-4" />}
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

interface DashboardLayoutProps {
    title?: string;
    titleKey?: string;
    description?: string;
    descriptionKey?: string;
    children: React.ReactNode;
    actions?: DashboardHeaderProps['actions'];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
    title, 
    titleKey, 
    description, 
    descriptionKey, 
    children, 
    actions 
}) => {
    const { t } = useTranslation(['neuron', 'common']);

    const finalTitle = titleKey ? t(titleKey) : (title || '');
    const finalDescription = descriptionKey ? t(descriptionKey) : (description || '');

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <DashboardHeader title={finalTitle} description={finalDescription} actions={actions} />
            <div className="min-h-0">
                {children}
            </div>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ElementType;
    trend?: {
        value: number;
        label: string;
        positive?: boolean;
    };
    color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, trend, color = "text-primary" }) => (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={cn("p-2 bg-secondary/50 rounded-lg", color)}>
                <Icon className="w-5 h-5" />
            </div>
            {trend && (
                <div className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    trend.positive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                )}>
                    {trend.value > 0 ? '+' : ''}{trend.value}%
                </div>
            )}
        </div>
        <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm font-medium text-muted-foreground">{title}</div>
            {description && <div className="text-xs text-muted-foreground mt-1">{description}</div>}
        </div>
    </div>
);

interface QuickActionCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    onClick: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, description, icon: Icon, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-4 p-4 w-full bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all text-left group"
    >
        <div className="p-3 bg-secondary rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
            <div className="font-semibold text-sm group-hover:text-primary transition-colors">{title}</div>
            <div className="text-xs text-muted-foreground">{description}</div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
    </button>
);

export const SectionHeader: React.FC<{ title: string; link?: { label: string; href: string } }> = ({ title, link }) => {
    const navigate = useNavigate();
    return (
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{title}</h3>
            {link && (
                <button 
                    onClick={() => navigate(link.href)}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                    {link.label} <ArrowRight className="w-3 h-3" />
                </button>
            )}
        </div>
    );
};
