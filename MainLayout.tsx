
import React, { useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useNetworkStore } from '../../store/useNetworkStore';
import { useWindowStore } from '../../store/useWindowStore';
import { useSyncStore } from '../../lib/syncEngine';
import { useArchiveStats } from '../../modules/system/archive/hooks/useArchiveStats';
import { cn } from '../../lib/utils';
import { Navigation, NavItem } from './Navigation';
import { GlobalSearch } from '../common/GlobalSearch';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { SimpleLanguageSwitcher } from '../common/SimpleLanguageSwitcher';
import { 
  LayoutDashboard, 
  Briefcase, 
  Heart, 
  Cpu, 
  Menu, 
  Settings,
  LogOut,
  Search,
  Bell,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  RefreshCw,
  Archive,
  Target,
  BrainCircuit,
  Lightbulb,
  Book,
  FolderKanban,
  Database,
  FileText,
  CheckSquare
} from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { t } = useTranslation(['common', 'navigation']);
  const { isSidebarOpen, toggleSidebar, logout, user, theme, setTheme } = useAppStore();
  const { isOnline } = useNetworkStore();
  const { openWindow } = useWindowStore();
  const { isSyncing, queue } = useSyncStore();
  const { stats } = useArchiveStats(); 
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic Navigation Config based on Translation with 'navigation' namespace
  const navItems: NavItem[] = useMemo(() => [
    { id: 'dashboard', title: t('navigation:dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { 
      id: 'work', 
      title: t('navigation:work'), 
      path: '/work', 
      icon: Briefcase,
      children: [
        { id: 'goals', title: t('navigation:goals'), path: '/work/goals' },
        { id: 'crm', title: t('navigation:crm'), path: '/work/crm' },
        { id: 'finance', title: t('navigation:finance'), path: '/work/finance' },
      ]
    },
    { 
      id: 'life', 
      title: t('navigation:life'), 
      path: '/life', 
      icon: Heart,
      children: [
          { id: 'overview', title: t('navigation:overview'), path: '/life/overview' },
          { id: 'habits', title: t('navigation:habits'), path: '/life/habits' },
          { id: 'life-finance', title: t('navigation:lifeFinance'), path: '/life/finance' },
      ]
    },
    { 
      id: 'neuron', 
      title: t('navigation:neuron'), 
      path: '/neuron', 
      icon: Cpu,
      children: [
          { id: 'connections', title: t('navigation:connections'), path: '/neuron/connections', icon: BrainCircuit },
          { id: 'ideas', title: t('navigation:ideas'), path: '/neuron/ideas', icon: Lightbulb },
          { id: 'domains', title: t('navigation:domains'), path: '/neuron/domains', icon: Book },
          { id: 'projects', title: t('navigation:projects'), path: '/neuron/projects', icon: FolderKanban },
          { id: 'tasks', title: t('navigation:tasks'), path: '/neuron/tasks', icon: CheckSquare },
          { id: 'resources', title: t('navigation:resources'), path: '/neuron/resources', icon: Database },
          { id: 'notes', title: t('navigation:notes'), path: '/neuron/notes', icon: FileText },
          { id: 'goals', title: t('navigation:goals'), path: '/neuron/goals', icon: Target },
      ]
    },
    {
        id: 'system',
        title: t('navigation:system'),
        path: '/system',
        icon: Settings,
        children: [
            { id: 'status', title: t('navigation:status'), path: '/system/status' },
            { id: 'archive', title: t('navigation:archive'), path: '/system/archive' },
        ]
    }
  ], [t]);

  const getPageTitle = (pathname: string) => {
    // Flatten nav items to find match
    const flatItems: { path: string; title: string }[] = [];
    const traverse = (items: NavItem[]) => {
      items.forEach(item => {
        flatItems.push({ path: item.path, title: item.title });
        if (item.children) traverse(item.children);
      });
    };
    traverse(navItems);

    const match = flatItems.find(item => pathname.startsWith(item.path) && item.path !== '/');
    return match ? match.title : t('common:app.name');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleOpenSearch = () => {
      openWindow('global-search', t('common:app.search'), <GlobalSearch onClose={() => {}} />);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleOpenSearch();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <aside 
        className={cn(
          "flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out z-30",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-border">
          <div className="flex items-center gap-2 overflow-hidden cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold">N</span>
            </div>
            <span className={cn("font-bold text-xl tracking-tight transition-opacity duration-300", !isSidebarOpen && "opacity-0 hidden")}>
              Nexus<span className="text-primary">蓝洞</span>
            </span>
          </div>
        </div>

        <Navigation items={navItems} isOpen={isSidebarOpen} />

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border space-y-3">
          {isSidebarOpen && (
            <div className="flex items-center justify-between px-1 animate-in fade-in">
               <SimpleLanguageSwitcher />
            </div>
          )}
          
          <button 
            onClick={() => navigate('/settings')}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0 border-2 border-background shadow-sm" />
            <div className={cn("flex-1 text-left overflow-hidden", !isSidebarOpen && "hidden")}>
              <p className="text-sm font-medium truncate">{user?.name || 'Architect'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@nexus.io'}</p>
            </div>
            {isSidebarOpen && <Settings className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-background/50 relative">
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold hidden md:block">
                {getPageTitle(location.pathname)}
            </h2>

            <div className="relative hidden lg:block w-64 cursor-pointer ml-4" onClick={handleOpenSearch}>
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <div className="w-full bg-secondary/30 border border-input/50 rounded-full pl-9 pr-4 py-1.5 text-sm text-muted-foreground flex justify-between hover:bg-secondary/50 transition-colors">
                    <span className="opacity-70">{t('common:search')}</span>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
             {!isOnline && (
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-destructive/10 text-destructive text-xs rounded-full font-medium">
                    <WifiOff className="w-3 h-3" />
                    <span className="hidden sm:inline">{t('common:offline')}</span>
                 </div>
             )}
             {isOnline && (isSyncing || queue.length > 0) && (
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-500 text-xs rounded-full font-medium animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span className="hidden sm:inline">{t('common:syncing')} ({queue.length})</span>
                 </div>
             )}

            <button 
                onClick={() => navigate('/system/archive')}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary transition-colors relative"
                title={t('navigation:archive')}
            >
                <Archive className="w-4 h-4" />
                {stats && stats.totalItems > 10 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border border-background"></span>
                )}
            </button>

            <div className="hidden sm:block">
               <LanguageSwitcher />
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
              title={t('common:theme.switch')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
            </button>
            
            <div className="h-6 w-px bg-border mx-1" />

            <button 
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2 p-2 rounded-md hover:bg-secondary"
              title={t('common:exit')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500 slide-in-from-bottom-4 h-full">
            <Outlet />
          </div>
        </div>

        <footer className="h-8 border-t border-border bg-card flex items-center justify-between px-4 text-xs text-muted-foreground shrink-0">
             <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                    {isOnline ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-red-500" />}
                    <span className="hidden sm:inline">{isOnline ? t('common:systemOnline') : t('common:syncPaused')}</span>
                </span>
                <span>v1.0.0</span>
             </div>
             <div>
                {t('common:lastSynced')}: {new Date().toLocaleTimeString()}
             </div>
        </footer>
      </main>
    </div>
  );
};
