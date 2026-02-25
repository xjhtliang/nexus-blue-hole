import React from 'react';
import { Task } from '../../../../types/neuron';
import { formatDate } from '../../../../lib/utils';
import { Flag, Calendar, Tag } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface TaskTableProps {
    tasks: Task[];
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
    const priorityColor = {
        HIGH: 'text-red-500',
        MEDIUM: 'text-amber-500',
        LOW: 'text-blue-500',
    };

    return (
        <div className="rounded-md border border-border overflow-hidden bg-card">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border">
                        <tr>
                            <th className="px-6 py-3 font-medium w-12"></th>
                            <th className="px-6 py-3 font-medium">Task Name</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Priority</th>
                            <th className="px-6 py-3 font-medium">Due Date</th>
                            <th className="px-6 py-3 font-medium">Tags</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {tasks.map((task) => (
                            <tr key={task.id} className="bg-background hover:bg-secondary/50 transition-colors cursor-pointer">
                                <td className="px-6 py-4">
                                    <input type="checkbox" className="rounded border-input" checked={task.status === 'DONE'} readOnly />
                                </td>
                                <td className="px-6 py-4 font-medium text-foreground">
                                    {task.title}
                                </td>
                                <td className="px-6 py-4">
                                     <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-medium border",
                                        task.status === 'DONE' ? "bg-green-500/10 text-green-600 border-green-500/20" : 
                                        task.status === 'IN_PROGRESS' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                        task.status === 'OVERDUE' ? "bg-red-500/10 text-red-600 border-red-500/20" :
                                        "bg-secondary text-muted-foreground border-border"
                                     )}>
                                        {task.status.replace('_', ' ')}
                                     </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <Flag className={cn("w-3 h-3", priorityColor[task.priority])} />
                                        <span className="text-xs">{task.priority}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                                    {task.dueDate && (
                                        <>
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(task.dueDate)}
                                        </>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1">
                                        {task.tags.map(tag => (
                                            <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-secondary text-secondary-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};