import React, { useEffect } from 'react';
import { useNeuronStore } from '../../../store/useNeuronStore';
import { useLayoutStore, ViewMode } from '../../../store/useLayoutStore';
import { DataLayout, LayoutMode } from '../../../components/ui/data-layout/DataLayout';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskCalendar } from '../components/tasks/TaskCalendar';
import { ListView } from '../../../components/ui/data-layout/ListView';
import { GalleryView } from '../../../components/layout/views/GalleryView';
import { TimelineView } from '../../../components/layout/views/TimelineView';
import { Wand2, Plus, Flag, Calendar as CalendarIcon, Archive, MoreVertical } from 'lucide-react';
import { cn, formatDate } from '../../../lib/utils';
import { Task } from '../../../types/neuron';

export const TasksPage: React.FC = () => {
    const { 
        tasks, 
        fetchTasks, 
        moveTask, 
        archiveTask,
        autoScheduleTasks,
        isLoadingTasks 
    } = useNeuronStore();

    const { setLayoutMode, getLayoutMode } = useLayoutStore();
    const currentView = getLayoutMode('tasks', 'BOARD');

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleModeChange = (mode: LayoutMode) => {
        setLayoutMode('tasks', mode as ViewMode);
    };

    const handleArchive = async (task: Task) => {
        // Confirmation is good UX
        if (confirm(`Archive task "${task.title}"?`)) {
            await archiveTask(task.id);
        }
    };

    const renderListView = () => (
        <ListView<Task> 
            data={tasks}
            keyExtractor={(t) => t.id}
            renderTitle={(t) => t.title}
            renderSubtitle={(t) => t.tags.join(', ')}
            renderStatus={(t) => (
                 <span className={cn(
                    "w-2 h-2 rounded-full",
                    t.status === 'DONE' ? "bg-green-500" : 
                    t.status === 'IN_PROGRESS' ? "bg-blue-500" : "bg-secondary"
                 )} />
            )}
            renderMeta={(t) => (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Flag className="w-3 h-3 text-muted-foreground" />
                        <span>{t.priority}</span>
                    </div>
                    {t.dueDate && <span className="text-xs">{formatDate(t.dueDate)}</span>}
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleArchive(t); }}
                        className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-amber-500 transition-colors"
                        title="Archive"
                    >
                        <Archive className="w-4 h-4" />
                    </button>
                </div>
            )}
            onItemClick={(item) => console.log('Open task', item.id)}
        />
    );

    const renderGalleryView = () => (
        <GalleryView<Task>
            data={tasks}
            renderItem={({ item, isOverlay }) => (
                <div className={cn(
                    "h-full p-4 bg-card border border-border rounded-xl flex flex-col transition-all relative group",
                    !isOverlay && "hover:shadow-md"
                )}>
                    <div className="flex justify-between items-start mb-2">
                        <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full border",
                            item.priority === 'HIGH' ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-secondary text-muted-foreground"
                        )}>{item.priority}</span>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleArchive(item); }}
                                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-amber-500"
                                title="Archive"
                            >
                                <Archive className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                    <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-3 h-3" />
                            {item.dueDate ? formatDate(item.dueDate) : 'No Date'}
                        </div>
                    </div>
                </div>
            )}
        />
    );

    const renderTimelineView = () => (
        <TimelineView<Task>
            items={tasks}
            startDateAccessor={(t) => t.startDate || t.createdAt}
            endDateAccessor={(t) => t.dueDate || new Date(new Date(t.createdAt).getTime() + 86400000)} // Default 1 day
            titleAccessor={(t) => t.title}
            onItemClick={(t) => console.log('Timeline click', t.id)}
            renderItem={(item, style) => (
                 <div 
                    style={style}
                    className={cn(
                        "rounded px-2 text-xs flex items-center justify-between font-medium shadow-sm border truncate hover:brightness-110 cursor-pointer group",
                        item.status === 'DONE' ? "bg-green-500/20 text-green-700 border-green-500/30" :
                        item.priority === 'HIGH' ? "bg-red-500/20 text-red-700 border-red-500/30" :
                        "bg-blue-500/20 text-blue-700 border-blue-500/30"
                    )}
                 >
                    <span className="truncate">{item.title}</span>
                    <span className="text-[9px] opacity-70 ml-1 hidden group-hover:inline-block">
                        {item.status}
                    </span>
                 </div>
            )}
        />
    );

    return (
        <DataLayout
            title="Task Master"
            mode={currentView as LayoutMode}
            onModeChange={handleModeChange}
            actions={
                <div className="flex items-center gap-2">
                    <button 
                        onClick={autoScheduleTasks}
                        className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-md transition-colors"
                        title="Smart Plan"
                    >
                        <Wand2 className="w-5 h-5" />
                    </button>
                    <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                        <Plus className="w-4 h-4" />
                        New Task
                    </button>
                </div>
            }
        >
            {isLoadingTasks ? (
                <div className="h-full flex items-center justify-center">Loading tasks...</div>
            ) : (
                <>
                    {currentView === 'BOARD' && <TaskBoard tasks={tasks} onMoveTask={moveTask} />}
                    {currentView === 'TABLE' && <TaskTable tasks={tasks} />}
                    {currentView === 'CALENDAR' && <TaskCalendar tasks={tasks} />}
                    {currentView === 'LIST' && renderListView()}
                    {currentView === 'GALLERY' && renderGalleryView()}
                    {currentView === 'TIMELINE' && renderTimelineView()}
                </>
            )}
        </DataLayout>
    );
};