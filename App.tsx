
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './src/components/layout/MainLayout';
import { Dashboard } from './src/components/dashboard/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { WindowManager } from './src/components/ui/window/WindowManager';
import ErrorBoundary from './src/components/error/ErrorBoundary';
import RoutesDebug from './src/pages/debug/RoutesDebug';

// CRM Imports
import { CrmLayout } from './src/features/crm/CrmLayout';
import { LeadsPage } from './src/features/crm/pages/LeadsPage';
import { LeadDetailPage } from './src/features/crm/pages/LeadDetailPage';
import { PipelinePage } from './src/features/crm/pages/PipelinePage';
import { PublicPoolPage } from './src/features/crm/pages/PublicPoolPage';

// Work - Left Brain Imports
import { GoalsPage } from './src/features/work/pages/GoalsPage';
import { FinancePage } from './src/features/work/pages/FinancePage';

// Life - Right Brain Imports
import { HabitsPage } from './src/features/life/pages/HabitsPage';
import { LifeDashboardPage } from './src/features/life/pages/LifeDashboardPage';
import { LifeFinancePage } from './src/features/life/pages/LifeFinancePage';

// Tools - Neuron Pages (List Views)
import { TasksPage } from './src/features/tools/pages/TasksPage';
import { NotesPage } from './src/features/tools/pages/NotesPage';
import { GoalTrackerPage } from './src/features/tools/pages/GoalTrackerPage';
import { ResourcesPage } from './src/features/tools/pages/ResourcesPage';
import { ProjectsPage } from './src/features/tools/pages/ProjectsPage';
import { ProjectDetailPage } from './src/features/tools/pages/ProjectDetailPage';
import { IdeasPage } from './src/features/tools/pages/IdeasPage';
import { DomainsPage } from './src/features/tools/pages/DomainsPage';
import { GlobalGraphPage } from './src/features/tools/pages/GlobalGraphPage';

// Neuron Dashboards (Consolidated Import)
import { 
    ConnectionsDashboard,
    IdeasDashboard, 
    TasksDashboard, 
    DomainsDashboard, 
    ProjectsDashboard, 
    ResourcesDashboard, 
    NotesDashboard, 
    GoalsDashboard 
} from './src/features/tools/dashboards/NeuronDashboards';

// System Imports
import ArchiveCenterPage from './src/features/system/pages/ArchiveCenterPage';
import SystemStatusPage from './src/features/system/pages/SystemStatusPage';
import SettingsPage from './src/features/system/pages/SettingsPage';

// --- Client Setup ---
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// --- Lazy Components ---
const WorkLayout = () => <div className="p-4 h-full"><Outlet /></div>;
const LifeLayout = () => <div className="p-4 h-full"><Outlet /></div>;
const NeuronLayout = () => <div className="p-4 h-full"><Outlet /></div>;
const SystemLayout = () => <div className="p-4 h-full"><Outlet /></div>;

const LoginPage = () => <div className="h-screen flex items-center justify-center"><h1>Login Page</h1></div>;

// --- Loading Component ---
const PageLoader = () => (
  <div className="h-full w-full flex items-center justify-center p-20">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <WindowManager />
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/auth">
                  <Route path="login" element={<LoginPage />} />
              </Route>

              {/* Protected Application Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Debug Route */}
                <Route path="debug/routes" element={<RoutesDebug />} />

                {/* Work Module */}
                <Route path="work" element={<WorkLayout />}>
                   <Route index element={<Navigate to="goals" replace />} />
                   
                   {/* CRM Sub-Module */}
                   <Route path="crm" element={<CrmLayout />}>
                      <Route index element={<Navigate to="leads" replace />} />
                      <Route path="leads" element={<LeadsPage />} />
                      <Route path="leads/:id" element={<LeadDetailPage />} />
                      <Route path="pipeline" element={<PipelinePage />} />
                      <Route path="public" element={<PublicPoolPage />} />
                   </Route>

                   <Route path="goals" element={<GoalsPage />} />
                   <Route path="finance" element={<FinancePage />} />
                </Route>
                
                {/* Life Module */}
                <Route path="life" element={<LifeLayout />}>
                   <Route index element={<Navigate to="overview" replace />} />
                   <Route path="overview" element={<LifeDashboardPage />} />
                   <Route path="habits" element={<HabitsPage />} />
                   <Route path="finance" element={<LifeFinancePage />} />
                </Route>
                
                {/* Neuron Module */}
                <Route path="neuron" element={<NeuronLayout />}>
                   {/* Default Redirect to Graph */}
                   <Route index element={<Navigate to="connections" replace />} />
                   
                   {/* Global Graph */}
                   <Route path="connections" element={<ConnectionsDashboard />} />
                   <Route path="connections/view" element={<GlobalGraphPage />} />

                   {/* Ideas */}
                   <Route path="ideas" element={<IdeasDashboard />} />
                   <Route path="ideas/list" element={<IdeasPage />} />

                   {/* Domains */}
                   <Route path="domains" element={<DomainsDashboard />} />
                   <Route path="domains/list" element={<DomainsPage />} />

                   {/* Tasks */}
                   <Route path="tasks" element={<TasksDashboard />} />
                   <Route path="tasks/list" element={<TasksPage />} />

                   {/* Projects */}
                   <Route path="projects" element={<ProjectsDashboard />} />
                   <Route path="projects/list" element={<ProjectsPage />} />
                   <Route path="projects/:id" element={<ProjectDetailPage />} />

                   {/* Resources */}
                   <Route path="resources" element={<ResourcesDashboard />} />
                   <Route path="resources/list" element={<ResourcesPage />} />

                   {/* Notes */}
                   <Route path="notes" element={<NotesDashboard />} />
                   <Route path="notes/list" element={<NotesPage />} />

                   {/* Goals */}
                   <Route path="goals" element={<GoalsDashboard />} />
                   <Route path="goals/list" element={<GoalTrackerPage />} />
                </Route>

                {/* System Module */}
                <Route path="system" element={<SystemLayout />}>
                    <Route index element={<Navigate to="status" replace />} />
                    <Route path="status" element={<SystemStatusPage />} />
                    <Route path="archive" element={<ArchiveCenterPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

                 {/* Settings */}
                 <Route path="settings" element={<SettingsPage />} />
              </Route>
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
