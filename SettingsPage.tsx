
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../store/useAppStore';
import { SimpleLanguageSwitcher } from '../../../components/common/SimpleLanguageSwitcher';
import { DashboardLayout } from '../../../components/dashboard/NeuronDashboardComponents';
import { Moon, Sun, Monitor, Globe, Bell, Shield, User } from 'lucide-react';
import { cn } from '../../../lib/utils';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation(['common', 'system']);
  const { theme, setTheme, user } = useAppStore();

  return (
    <DashboardLayout
      title={t('common:settings')}
      description={t('system:settings.title')}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Appearance Section */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t('common:theme.switch')}</h2>
              <p className="text-sm text-muted-foreground">Customize the look and feel of Nexus.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all hover:bg-secondary",
                theme === 'light' ? "border-primary bg-primary/5" : "border-transparent bg-secondary/50"
              )}
            >
              <Sun className="w-8 h-8 text-orange-500" />
              <span className="font-medium text-sm">{t('common:theme.light')}</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all hover:bg-secondary",
                theme === 'dark' ? "border-primary bg-primary/5" : "border-transparent bg-secondary/50"
              )}
            >
              <Moon className="w-8 h-8 text-blue-500" />
              <span className="font-medium text-sm">{t('common:theme.dark')}</span>
            </button>
            <button
              onClick={() => setTheme('system')}
              className={cn(
                "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all hover:bg-secondary",
                theme === 'system' ? "border-primary bg-primary/5" : "border-transparent bg-secondary/50"
              )}
            >
              <Monitor className="w-8 h-8 text-slate-500" />
              <span className="font-medium text-sm">{t('common:theme.system')}</span>
            </button>
          </div>
        </div>

        {/* Language Section */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{t('common:language.switch')}</h2>
              <p className="text-sm text-muted-foreground">Select your preferred language.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border">
            <span className="text-sm font-medium">Interface Language</span>
            <SimpleLanguageSwitcher />
          </div>
        </div>

        {/* Profile Placeholder */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm opacity-70">
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Account</h2>
              <p className="text-sm text-muted-foreground">Manage your profile and security.</p>
            </div>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center py-2">
                <span className="text-sm">Email</span>
                <span className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</span>
             </div>
             <div className="flex justify-between items-center py-2">
                <span className="text-sm">Role</span>
                <span className="text-xs bg-secondary px-2 py-1 rounded">Administrator</span>
             </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
