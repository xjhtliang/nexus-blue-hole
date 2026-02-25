
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNeuronStore } from '../../../store/useNeuronStore';
import { ArrowLeft, LayoutDashboard, Flag, ShieldAlert, Users, DollarSign, Kanban, Network, Link as LinkIcon, FileText, CheckSquare, Plus } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';

// Modular Components
import { ProjectDashboard } from '../../../modules/neuron/projects/components/ProjectExecution/ProjectDashboard';
import { RiskAssessment } from '../../../modules/neuron/projects/components/ProjectPlanning/RiskAssessment';
import { ResourceAllocation } from '../../../modules/neuron/projects/components/ProjectPlanning/ResourceAllocation';
import { CostControl } from '../../../modules/neuron/projects/components/ProjectMonitoring/CostControl';
import { GanttChart } from '../../../modules/neuron/milestones/components/MilestoneVisualization/GanttChart';
import { NetworkDiagram } from '../../../modules/neuron/milestones/components/MilestoneVisualization/NetworkDiagram';
import { StatusBoard } from '../../../modules/neuron/milestones/components/MilestoneManager/StatusBoard';
import { ResourcePanel } from '../../../modules/neuron/projects/components/ProjectResources/ResourcePanel';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { NoteEditor } from '../components/notes/NoteEditor';

export const ProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { 
        projects, 
        tasks, 
        notes,
        activeProjectId, 
        setActiveProject, 
        fetchProjects, 
        fetchTasks,
        fetchNotesData,
        fetchResources,
        toggleProjectMilestone, 
        moveTask,
        createNote
    } = useNeuronStore();
    const [milestoneView, setMilestoneView] = useState<'GANTT' | 'NETWORK' | 'BOARD'>('GANTT');

    useEffect(() => {
        if (!projects.length) fetchProjects();
        fetchTasks();
        fetchNotesData();
        fetchResources();
    }, []);

    useEffect(() => {
        if (id) setActiveProject(id);
        return () => setActiveProject(null);
    }, [id, projects]);

    const project = projects.find(p => p.id === id);

    if (!project) return <div className="p-8">Project not found</div>;

    // Filter Linked Data
    const projectTasks = tasks.filter(t => t.projectId === project.id);
    const projectNotes = notes.filter(n => n.projectId === project.id);

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <button onClick={() => navigate('/neuron/projects')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to Projects
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                            <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", 
                                project.status === 'ACTIVE' ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-secondary text-muted-foreground"
                            )}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-1 max-w-2xl">{project.description}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                <div className="overflow-x-auto pb-2">
                    <TabsList className="flex items-center gap-2 bg-card border border-border p-1 rounded-lg w-max mb-2">
                        <TabsTrigger value="overview" className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary/50">
                            <LayoutDashboard className="w-4 h-4" /> Overview
                        </TabsTrigger>
                        <TabsTrigger value="tasks" className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary/50">
                            <CheckSquare className="w-4 h-4" /> Tasks
                            <span className="bg-background/20 px-1.5 rounded-full text-[10px]">{projectTasks.length}</span>
                        </TabsTrigger>
                        <TabsTrigger value="milestones" className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary/50">
                            <Flag className="w-4 h-4" /> Milestones
                        </TabsTrigger>
                        <TabsTrigger value="docs" className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary/50">
                            <FileText className="w-4 h-4" /> Docs
                            <span className="bg-background/20 px-1.5 rounded-full text-[10px]">{projectNotes.length}</span>
                        </TabsTrigger>
                        <TabsTrigger value="resources" className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary/50">
                            <LinkIcon className="w-4 h-4" /> Resources
                        </TabsTrigger>
                        <TabsTrigger value="team" className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary/50">
                            <Users className="w-4 h-4" /> Team
                        </TabsTrigger>
                        <TabsTrigger value="risks" className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary/50">
                            <ShieldAlert className="w-4 h-4" /> Risks
                        </TabsTrigger>
                        <TabsTrigger value="budget" className="px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-secondary/50">
                            <DollarSign className="w-4 h-4" /> Budget
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto">
                    <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <ProjectDashboard project={project} />
                    </TabsContent>

                    <TabsContent value="tasks" className="h-full animate-in fade-in slide-in-from-bottom-2">
                        <TaskBoard tasks={projectTasks} onMoveTask={moveTask} />
                    </TabsContent>

                    <TabsContent value="milestones" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        {/* View Switcher */}
                        <div className="flex justify-end mb-2">
                            <div className="flex bg-secondary p-1 rounded-lg">
                                <button 
                                    onClick={() => setMilestoneView('GANTT')}
                                    className={cn("p-1.5 rounded transition-colors", milestoneView === 'GANTT' ? "bg-card shadow text-foreground" : "text-muted-foreground")}
                                    title="Gantt Chart"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setMilestoneView('NETWORK')}
                                    className={cn("p-1.5 rounded transition-colors", milestoneView === 'NETWORK' ? "bg-card shadow text-foreground" : "text-muted-foreground")}
                                    title="Dependency Network"
                                >
                                    <Network className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => setMilestoneView('BOARD')}
                                    className={cn("p-1.5 rounded transition-colors", milestoneView === 'BOARD' ? "bg-card shadow text-foreground" : "text-muted-foreground")}
                                    title="Kanban Board"
                                >
                                    <Kanban className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-6">
                            {milestoneView === 'GANTT' && (
                                <GanttChart milestones={project.milestones} startDate={project.startDate} endDate={project.endDate} />
                            )}
                            {milestoneView === 'NETWORK' && (
                                <NetworkDiagram milestones={project.milestones} />
                            )}
                            {milestoneView === 'BOARD' && (
                                <StatusBoard milestones={project.milestones} onStatusChange={(mId) => toggleProjectMilestone(project.id, mId)} />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="docs" className="h-full animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                            <div className="md:col-span-1 bg-card border border-border rounded-xl p-4 flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold">Project Notes</h3>
                                    <button 
                                        onClick={() => createNote(undefined, undefined, project.id)}
                                        className="p-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-2 overflow-y-auto flex-1">
                                    {projectNotes.map(note => (
                                        <div key={note.id} className="p-3 border border-border rounded hover:bg-secondary cursor-pointer">
                                            <div className="font-medium text-sm">{note.title}</div>
                                            <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                Last edited {new Date(note.updatedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                    {projectNotes.length === 0 && <div className="text-center text-muted-foreground text-sm py-8">No documents linked.</div>}
                                </div>
                            </div>
                            <div className="md:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col justify-center items-center text-muted-foreground">
                                <FileText className="w-12 h-12 mb-4 opacity-20" />
                                <p>Select a document to preview or edit.</p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="resources" className="h-full animate-in fade-in slide-in-from-bottom-2">
                        <ResourcePanel project={project} />
                    </TabsContent>

                    <TabsContent value="risks" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 h-full">
                        <RiskAssessment project={project} />
                    </TabsContent>

                    <TabsContent value="team" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 h-full">
                        <ResourceAllocation project={project} />
                    </TabsContent>

                    <TabsContent value="budget" className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <CostControl project={project} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};
