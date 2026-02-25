import React, { useEffect, useState } from 'react';
import { useNeuronStore } from '../../../store/useNeuronStore';
import { PersonalGoal, Milestone } from '../../../types/neuron';
import { cn, formatDate } from '../../../lib/utils';
import { Target, Calendar, CheckCircle2, Circle, Trophy, ArrowRight, FileText, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

export const GoalTrackerPage: React.FC = () => {
    const { 
        goals, 
        tasks, 
        notes, 
        fetchGoals, 
        fetchTasks, 
        fetchNotesData, 
        toggleMilestone, 
        addGoalAssociation, 
        removeGoalAssociation, 
        isLoadingGoals 
    } = useNeuronStore();
    
    const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
    const [yearFilter, setYearFilter] = useState<number>(2024);
    const [domainFilter, setDomainFilter] = useState<string>('ALL');
    const [showLinkMenu, setShowLinkMenu] = useState(false);

    useEffect(() => {
        fetchGoals();
        fetchTasks();
        fetchNotesData();
    }, []);

    const selectedGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

    // Derived State
    const filteredGoals = goals.filter(g => 
        g.year === yearFilter && 
        (domainFilter === 'ALL' || g.domain === domainFilter)
    );

    // Helper: Calculate progress based on weighted milestones
    const calculateProgress = (goal: PersonalGoal) => {
        if (!goal.milestones || goal.milestones.length === 0) return 0;
        const totalWeight = goal.milestones.reduce((acc, m) => acc + m.weight, 0);
        const completedWeight = goal.milestones.filter(m => m.status === 'COMPLETED').reduce((acc, m) => acc + m.weight, 0);
        return Math.round((completedWeight / totalWeight) * 100);
    };

    const daysRemaining = (date: Date) => {
        const diff = new Date(date).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    };

    const handleAddLink = (targetId: string, type: 'TASK' | 'NOTE') => {
        if (selectedGoal) {
            addGoalAssociation(selectedGoal.id, targetId, type);
            setShowLinkMenu(false);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Personal Goal Tracker</h1>
                    <p className="text-muted-foreground">Track your life's ambitions and key results.</p>
                </div>
                <div className="flex gap-2">
                    <select 
                        className="bg-card border border-input rounded-md px-3 py-1 text-sm"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(Number(e.target.value))}
                    >
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                    </select>
                    <select 
                        className="bg-card border border-input rounded-md px-3 py-1 text-sm"
                        value={domainFilter}
                        onChange={(e) => setDomainFilter(e.target.value)}
                    >
                        <option value="ALL">All Domains</option>
                        <option value="WORK">Work</option>
                        <option value="STUDY">Study</option>
                        <option value="HEALTH">Health</option>
                        <option value="LIFE">Life</option>
                    </select>
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                        <Plus className="w-4 h-4" />
                        New Goal
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Left: Goal List */}
                <div className="col-span-4 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-border bg-secondary/10">
                        <h3 className="font-semibold text-sm">Goals ({filteredGoals.length})</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {isLoadingGoals ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                        ) : filteredGoals.map(goal => {
                            const progress = calculateProgress(goal);
                            return (
                                <button
                                    key={goal.id}
                                    onClick={() => setSelectedGoalId(goal.id)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-lg border transition-all hover:shadow-sm",
                                        selectedGoal?.id === goal.id 
                                            ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20" 
                                            : "bg-background border-border hover:border-primary/50"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary border border-border">
                                            {goal.domain}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-medium px-2 py-0.5 rounded-full",
                                            goal.status === 'COMPLETED' ? "bg-green-100 text-green-700" :
                                            goal.status === 'IN_PROGRESS' ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                                        )}>
                                            {goal.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-sm mb-3">{goal.title}</h4>
                                    
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Progress</span>
                                            <span>{progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary transition-all duration-500" 
                                                style={{ width: `${progress}%` }} 
                                            />
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Detail View */}
                {selectedGoal ? (
                    <div className="col-span-8 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-border bg-gradient-to-r from-secondary/20 to-transparent">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target className="w-5 h-5 text-primary" />
                                        <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
                                            {selectedGoal.year} • {selectedGoal.domain}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tight mb-2">{selectedGoal.title}</h2>
                                    <p className="text-muted-foreground max-w-xl">{selectedGoal.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-primary font-mono">{calculateProgress(selectedGoal)}%</div>
                                    <div className="text-xs text-muted-foreground mt-1">Completion</div>
                                </div>
                            </div>
                            
                            <div className="flex gap-6 mt-6 pt-6 border-t border-border/50">
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span>Deadline: {formatDate(selectedGoal.endDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                    <span className={daysRemaining(selectedGoal.endDate) < 30 ? "text-amber-600 font-medium" : ""}>
                                        {daysRemaining(selectedGoal.endDate)} days remaining
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Content Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            
                            {/* Milestones */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                                    Key Milestones
                                </h3>
                                <div className="space-y-3">
                                    {selectedGoal.milestones.map(milestone => (
                                        <div 
                                            key={milestone.id}
                                            className={cn(
                                                "flex items-center p-4 rounded-lg border transition-all",
                                                milestone.status === 'COMPLETED' ? "bg-green-500/5 border-green-500/20" : "bg-card border-border hover:border-primary/30"
                                            )}
                                        >
                                            <button 
                                                onClick={() => toggleMilestone(selectedGoal.id, milestone.id)}
                                                className={cn(
                                                    "w-6 h-6 rounded-full flex items-center justify-center mr-4 transition-colors",
                                                    milestone.status === 'COMPLETED' ? "bg-green-500 text-white" : "border-2 border-muted-foreground text-transparent hover:border-primary"
                                                )}
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                            
                                            <div className="flex-1">
                                                <div className={cn("font-medium", milestone.status === 'COMPLETED' && "text-muted-foreground line-through")}>
                                                    {milestone.title}
                                                </div>
                                                {milestone.dueDate && (
                                                    <div className="text-xs text-muted-foreground mt-0.5">
                                                        Due: {formatDate(milestone.dueDate)}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-xs font-medium px-2 py-1 bg-secondary rounded border border-border">
                                                Weight: {milestone.weight}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Associations (Linked Tasks & Notes) */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <LinkIcon className="w-5 h-5 text-muted-foreground" />
                                        Linked Context
                                    </h3>
                                    <div className="relative">
                                        <button 
                                            onClick={() => setShowLinkMenu(!showLinkMenu)}
                                            className="text-xs flex items-center gap-1 text-primary hover:underline"
                                        >
                                            <Plus className="w-3 h-3" /> Link Item
                                        </button>
                                        
                                        {/* Dropdown for Linking */}
                                        {showLinkMenu && (
                                            <div className="absolute right-0 top-6 w-64 bg-popover border border-border rounded-md shadow-lg z-10 p-2 max-h-60 overflow-y-auto">
                                                <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">Link a Task</div>
                                                {tasks.slice(0, 3).map(t => (
                                                    <button 
                                                        key={t.id} 
                                                        onClick={() => handleAddLink(t.id, 'TASK')}
                                                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-secondary rounded truncate"
                                                    >
                                                        {t.title}
                                                    </button>
                                                ))}
                                                <div className="my-1 border-t border-border"></div>
                                                <div className="text-xs font-semibold text-muted-foreground mb-1 px-2">Link a Note</div>
                                                {notes.slice(0, 3).map(n => (
                                                    <button 
                                                        key={n.id} 
                                                        onClick={() => handleAddLink(n.id, 'NOTE')}
                                                        className="w-full text-left px-2 py-1.5 text-sm hover:bg-secondary rounded truncate"
                                                    >
                                                        {n.title}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {selectedGoal.associations?.map(assoc => {
                                        const linkedTask = tasks.find(t => t.id === assoc.targetId);
                                        const linkedNote = notes.find(n => n.id === assoc.targetId);
                                        
                                        if (!linkedTask && !linkedNote) return null;

                                        return (
                                            <div key={assoc.id} className="p-4 border border-border rounded-lg bg-secondary/10 flex items-center justify-between gap-3 group">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="p-2 bg-secondary rounded shrink-0">
                                                        {assoc.targetType === 'TASK' ? <CheckCircle2 className="w-4 h-4 text-blue-500" /> : <FileText className="w-4 h-4 text-orange-500" />}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-medium truncate">
                                                            {linkedTask?.title || linkedNote?.title}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {assoc.targetType} • Linked {formatDate(assoc.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => removeGoalAssociation(selectedGoal.id, assoc.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                    
                                    {(!selectedGoal.associations || selectedGoal.associations.length === 0) && (
                                        <div className="col-span-2 text-center py-8 border-2 border-dashed border-border rounded-lg text-muted-foreground text-sm">
                                            No tasks or notes linked. Add context to track your goal better.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="col-span-8 flex items-center justify-center text-muted-foreground">
                        Select a goal to view details.
                    </div>
                )}
            </div>
        </div>
    );
};