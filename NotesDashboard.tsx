
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNeuronStore } from '../../../../store/useNeuronStore';
import { 
    DashboardLayout
} from '../../../../components/dashboard/NeuronDashboardComponents';
import { FileText, Plus } from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { formatDate } from '../../../../lib/utils';
import dayjs from 'dayjs';

const NotesDashboard = () => {
    const { t } = useTranslation(['neuron', 'common']);
    const { notes, createNote } = useNeuronStore();
    const navigate = useNavigate();

    // Stats
    const totalNotes = notes.length;
    const pinnedNotes = notes.filter(n => n.isPinned).length;
    const thisMonth = new Date().getMonth();
    const newNotes = notes.filter(n => new Date(n.createdAt).getMonth() === thisMonth).length;
    
    // Tag Analysis
    const tagFreq: Record<string, number> = {};
    notes.forEach(n => n.tags.forEach(t => tagFreq[t] = (tagFreq[t] || 0) + 1));
    const topTags = Object.entries(tagFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    // Recent
    const recentNotes = [...notes]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3);

    // Mock Trend Data
    const trendData = [
        { name: 'Jan', value: 12 }, { name: 'Feb', value: 18 }, { name: 'Mar', value: 24 },
        { name: 'Apr', value: 15 }, { name: 'May', value: 28 }, { name: 'Jun', value: newNotes }
    ];

    return (
        <DashboardLayout
            titleKey="dashboard.notes.title"
            descriptionKey="dashboard.notes.description"
            actions={[
                { label: t('dashboard.notes.openNotebook', { ns: 'neuron' }), href: '/neuron/notes/list' },
                { label: t('dashboard.notes.newNote', { ns: 'neuron' }), icon: Plus, primary: true, onClick: () => { createNote(); navigate('/neuron/notes/list'); } }
            ]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.notes.growthTrend', { ns: 'neuron' })}</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                    <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis hide stroke="#888" fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorNotes)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.notes.recentlyUpdated', { ns: 'neuron' })}</h2>
                        <div className="space-y-3">
                            {recentNotes.map(note => (
                                <div key={note.id} className="p-3 border border-border rounded-lg hover:bg-secondary/30 flex justify-between items-center transition-colors">
                                    <div>
                                        <div className="font-medium text-sm mb-1">{note.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {dayjs(note.updatedAt).format('YYYY-MM-DD')} · {note.tags.length} tags
                                        </div>
                                    </div>
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                </div>
                            ))}
                            {recentNotes.length === 0 && <div className="text-muted-foreground text-sm">No notes yet.</div>}
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.notes.statistics', { ns: 'neuron' })}</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>{t('dashboard.notes.totalNotes', { ns: 'neuron' })}</span>
                                <span className="font-bold">{totalNotes}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('dashboard.notes.addedThisMonth', { ns: 'neuron' })}</span>
                                <span className="font-bold text-green-600">+{newNotes}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>{t('dashboard.notes.pinned', { ns: 'neuron' })}</span>
                                <span className="font-bold text-blue-600">{pinnedNotes}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">{t('dashboard.notes.popularTags', { ns: 'neuron' })}</h2>
                        <div className="flex flex-wrap gap-2">
                            {topTags.map(([tag, count]) => (
                                <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium border border-border flex items-center gap-1">
                                    {tag} <span className="opacity-50">({count})</span>
                                </span>
                            ))}
                            {topTags.length === 0 && <span className="text-xs text-muted-foreground">{t('dashboard.notes.noTags', { ns: 'neuron' })}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default NotesDashboard;
