
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNeuronStore } from '../../../../store/useNeuronStore';
import { 
    DashboardLayout,
    StatCard, 
    SectionHeader 
} from '../../../../components/dashboard/NeuronDashboardComponents';
import { CheckSquare, Play, Target, AlertTriangle, Clock, Plus } from 'lucide-react';
import { 
    PieChart, Pie, Tooltip, ResponsiveContainer
} from 'recharts';

const TasksDashboard = () => {
    const { t } = useTranslation(['neuron', 'common']);
    const { tasks } = useNeuronStore();
    
    const todo = tasks.filter(t => t.status === 'TODO').length;
    const progress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const done = tasks.filter(t => t.status === 'DONE').length;
    const highPriority = tasks.filter(t => t.priority === 'HIGH' && t.status !== 'DONE').length;

    return (
        <DashboardLayout
            titleKey="dashboard.tasks.title"
            descriptionKey="dashboard.tasks.description"
            actions={[
                { label: t('dashboard.tasks.viewList', { ns: 'neuron' }), href: '/neuron/tasks/list' },
                { label: t('dashboard.tasks.newTask', { ns: 'neuron' }), icon: Plus, href: '/neuron/tasks/list', primary: true }
            ]}
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard 
                    title={t('dashboard.tasks.todo', { ns: 'neuron' })} 
                    value={todo} 
                    icon={CheckSquare} 
                    color="text-slate-500" 
                />
                <StatCard 
                    title={t('dashboard.tasks.inProgress', { ns: 'neuron' })} 
                    value={progress} 
                    icon={Play} 
                    color="text-blue-500" 
                />
                <StatCard 
                    title={t('dashboard.tasks.completed', { ns: 'neuron' })} 
                    value={done} 
                    icon={Target} 
                    color="text-green-500" 
                />
                <StatCard 
                    title={t('dashboard.tasks.highPriority', { ns: 'neuron' })} 
                    value={highPriority} 
                    icon={AlertTriangle} 
                    color="text-red-500" 
                    description={t('dashboard.tasks.needsAttention', { ns: 'neuron' })} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <SectionHeader title={t('dashboard.tasks.priorityDistribution', { ns: 'neuron' })} />
                    <div className="h-[250px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'High', value: highPriority, fill: '#ef4444' },
                                        { name: 'Medium', value: tasks.filter(t => t.priority === 'MEDIUM' && t.status !== 'DONE').length, fill: '#f59e0b' },
                                        { name: 'Low', value: tasks.filter(t => t.priority === 'LOW' && t.status !== 'DONE').length, fill: '#3b82f6' }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <SectionHeader 
                        title={t('dashboard.tasks.upcomingDeadlines', { ns: 'neuron' })} 
                        link={{ label: t('dashboard.tasks.viewCalendar', { ns: 'neuron' }), href: '/neuron/tasks/list' }} 
                    />
                    <div className="space-y-4">
                        {tasks.filter(t => t.dueDate && t.status !== 'DONE')
                            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                            .slice(0, 5)
                            .map(task => (
                                <div key={task.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${task.priority === 'HIGH' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                        <span className="font-medium text-sm">{task.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        {new Date(task.dueDate!).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        }
                        {tasks.filter(t => t.dueDate).length === 0 && <div className="text-center text-muted-foreground py-8">No upcoming deadlines.</div>}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TasksDashboard;
