import React, { useEffect } from 'react';
import { useNeuronStore } from '../../../store/useNeuronStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Clock, CheckCircle2, PieChart } from 'lucide-react';
import { cn, formatDate } from '../../../lib/utils';

export const ProjectsPage: React.FC = () => {
    const { projects, fetchProjects, isLoadingProjects } = useNeuronStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            'PLANNING': 'bg-blue-100 text-blue-700',
            'ACTIVE': 'bg-green-100 text-green-700',
            'ON_HOLD': 'bg-amber-100 text-amber-700',
            'COMPLETED': 'bg-gray-100 text-gray-700'
        };
        return (
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide", styles[status as keyof typeof styles] || styles['ACTIVE'])}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Project Portfolio</h1>
                    <p className="text-muted-foreground">Manage initiatives, milestones, and resources.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90">
                    <Plus className="w-4 h-4" />
                    New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingProjects ? (
                    <div className="col-span-full p-12 text-center text-muted-foreground">Loading projects...</div>
                ) : projects.map(project => {
                    const completed = project.milestones.filter(m => m.status === 'COMPLETED').length;
                    const total = project.milestones.length;
                    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

                    return (
                        <div 
                            key={project.id} 
                            onClick={() => navigate(`/tools/projects/${project.id}`)}
                            className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <StatusBadge status={project.status} />
                            </div>
                            
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{project.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                {project.description}
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span className="font-medium">{percent}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t border-border">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(project.endDate)}
                                    </div>
                                    <div className="flex -space-x-2">
                                        {project.team.slice(0, 3).map((member, i) => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-secondary border border-card flex items-center justify-center text-[9px] font-medium">
                                                {member[0]}
                                            </div>
                                        ))}
                                        {project.team.length > 3 && (
                                            <div className="w-6 h-6 rounded-full bg-secondary border border-card flex items-center justify-center text-[9px]">
                                                +{project.team.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
