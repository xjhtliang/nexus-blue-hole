
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight, Target, Wallet, Activity, Zap, BrainCircuit, CheckSquare, FileText } from 'lucide-react';
import { useNeuronStore } from '../../store/useNeuronStore';
import { useAppStore } from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Mock Data
const goalData = [
  { name: 'Jan', work: 40, life: 24 },
  { name: 'Feb', work: 30, life: 13 },
  { name: 'Mar', work: 20, life: 58 },
  { name: 'Apr', work: 27, life: 39 },
  { name: 'May', work: 18, life: 48 },
  { name: 'Jun', work: 23, life: 38 },
];

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {trend && (
        <div className={cn("flex items-center text-xs font-medium px-2 py-1 rounded-full", 
          trend > 0 ? "text-green-600 bg-green-500/10" : "text-red-600 bg-red-500/10"
        )}>
          {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
    </div>
  </div>
);

const NeuronWidget = () => {
    const { t } = useTranslation('dashboard');
    const { tasks, notes, goals } = useNeuronStore();
    const navigate = useNavigate();
    
    // Quick stats
    const activeGoals = goals.filter(g => g.status === 'IN_PROGRESS');
    const todayTasks = tasks.filter(t => t.status === 'TODO').length;
    const recentNotes = notes.slice(0, 3);

    return (
        <div className="col-span-3 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <BrainCircuit className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-lg">{t('neuronPulse.title')}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-secondary/30 p-3 rounded-lg cursor-pointer hover:bg-secondary/50" onClick={() => navigate('/neuron/tasks')}>
                    <div className="text-2xl font-bold">{todayTasks}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckSquare className="w-3 h-3" /> {t('neuronPulse.pendingTasks')}
                    </div>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg cursor-pointer hover:bg-secondary/50" onClick={() => navigate('/neuron/goals')}>
                    <div className="text-2xl font-bold">{activeGoals.length}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Target className="w-3 h-3" /> {t('neuronPulse.activeGoals')}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <div className="text-xs font-medium text-muted-foreground uppercase mb-2">{t('neuronPulse.recentThoughts')}</div>
                <div className="space-y-2">
                    {recentNotes.map(note => (
                        <div 
                            key={note.id} 
                            onClick={() => navigate('/neuron/notes')}
                            className="flex items-center gap-3 p-2 hover:bg-secondary rounded-md cursor-pointer group"
                        >
                            <FileText className="w-4 h-4 text-orange-500" />
                            <span className="text-sm truncate flex-1">{note.title}</span>
                            <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const Dashboard: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'navigation']);
  const { user } = useAppStore();
  const { fetchTasks, fetchNotesData, fetchGoals } = useNeuronStore();

  React.useEffect(() => {
      // Ensure neuron data is loaded for the widget
      fetchTasks();
      fetchNotesData();
      fetchGoals();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
            {t('dashboard:welcomeTitle', { name: user?.name || 'Architect' })}
        </h1>
        <p className="text-muted-foreground mt-2">{t('dashboard:welcomeSubtitle')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title={t('dashboard:kpi.goals')} 
          value="78%" 
          icon={Target} 
          trend={{ value: 12.5, label: '', positive: true }} 
          color="bg-blue-600"
        />
        <StatCard 
          title={t('dashboard:kpi.revenue')} 
          value="¥ 124,500" 
          icon={Wallet} 
          trend={{ value: -2.4, label: '', positive: false }} 
          color="bg-emerald-600"
        />
        <StatCard 
          title={t('dashboard:kpi.leads')} 
          value="18" 
          icon={Zap} 
          trend={{ value: 5.2, label: '', positive: true }} 
          color="bg-amber-500"
        />
        <StatCard 
          title={t('dashboard:kpi.habits')} 
          value={`12 ${t('dashboard:kpi.days')}`} 
          icon={Activity} 
          trend={{ value: 0, label: '', positive: true }} 
          color="bg-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Main Chart */}
        <div className="col-span-4 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex flex-col space-y-2 mb-6">
            <h3 className="text-lg font-semibold">{t('dashboard:charts.workVsLife')}</h3>
            <p className="text-sm text-muted-foreground">{t('dashboard:charts.comparison')}</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="work" fill="#2563eb" radius={[4, 4, 0, 0]} name={t('navigation:work')} />
                <Bar dataKey="life" fill="#10b981" radius={[4, 4, 0, 0]} name={t('navigation:life')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Neuron Widget */}
        <NeuronWidget />

      </div>
    </div>
  );
};
