import React from 'react';
import { Task, TaskStatus } from '../../../../types/neuron';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { cn, formatDate } from '../../../../lib/utils';
import { Clock, AlertCircle } from 'lucide-react';

const COLUMNS: { id: TaskStatus; title: string }[] = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'DONE', title: 'Done' },
];

interface TaskBoardProps {
    tasks: Task[];
    onMoveTask: (id: string, status: TaskStatus) => void;
}

const DraggableTask = ({ task }: { task: Task }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
    });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
    } : undefined;

    const priorityColor = {
        HIGH: 'bg-red-500/10 text-red-600 border-red-500/20',
        MEDIUM: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        LOW: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="bg-card border border-border p-3 rounded-lg shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing mb-3 group"
        >
            <div className="flex justify-between items-start mb-2">
                <div className={cn("text-[10px] px-1.5 py-0.5 rounded border font-medium", priorityColor[task.priority])}>
                    {task.priority}
                </div>
                {task.dueDate && (
                     <div className={cn("flex items-center gap-1 text-[10px]", 
                        new Date() > task.dueDate && task.status !== 'DONE' ? "text-red-500" : "text-muted-foreground"
                     )}>
                        {new Date() > task.dueDate && task.status !== 'DONE' && <AlertCircle className="w-3 h-3" />}
                        {formatDate(task.dueDate, 'MM-DD')}
                     </div>
                )}
            </div>
            <div className="font-medium text-sm mb-2 group-hover:text-primary transition-colors">{task.title}</div>
            
            <div className="flex gap-1 flex-wrap">
                {task.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-secondary text-muted-foreground px-1 py-0.5 rounded">
                        #{tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

const DroppableColumn = ({ id, title, tasks }: { id: string, title: string, tasks: Task[] }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[280px] bg-secondary/20 rounded-xl p-2 flex flex-col h-full border border-transparent hover:border-border/50 transition-colors">
            <div className="flex justify-between items-center mb-3 px-2">
                <span className="font-semibold text-sm text-foreground">{title}</span>
                <span className="text-xs text-muted-foreground bg-secondary rounded px-1.5 py-0.5 border border-border">{tasks.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto px-1 scrollbar-hide">
                {tasks.map(task => (
                    <DraggableTask key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
};

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onMoveTask }) => {
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            onMoveTask(active.id as string, over.id as TaskStatus);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full overflow-x-auto pb-4">
                {COLUMNS.map(col => (
                    <DroppableColumn 
                        key={col.id} 
                        id={col.id} 
                        title={col.title} 
                        tasks={tasks.filter(t => t.status === col.id)} 
                    />
                ))}
            </div>
        </DndContext>
    );
};