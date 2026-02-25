import React from 'react';
import { Task } from '../../../../types/neuron';
import dayjs from 'dayjs';
import { cn } from '../../../../lib/utils';

interface TaskCalendarProps {
    tasks: Task[];
}

export const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks }) => {
    const startOfMonth = dayjs().startOf('month');
    const endOfMonth = dayjs().endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');

    const days = [];
    let day = startOfWeek;
    while (day.isBefore(endOfWeek)) {
        days.push(day);
        day = day.add(1, 'day');
    }

    const getTasksForDay = (date: dayjs.Dayjs) => {
        return tasks.filter(t => t.dueDate && dayjs(t.dueDate).isSame(date, 'day'));
    };

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden h-full flex flex-col">
            <div className="grid grid-cols-7 border-b border-border bg-secondary/30">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground">
                        {d}
                    </div>
                ))}
            </div>
            <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-background">
                {days.map((d, i) => {
                    const isCurrentMonth = d.month() === startOfMonth.month();
                    const dayTasks = getTasksForDay(d);
                    const isToday = d.isSame(dayjs(), 'day');

                    return (
                        <div 
                            key={i} 
                            className={cn(
                                "min-h-[100px] border-b border-r border-border p-2 transition-colors hover:bg-secondary/20",
                                !isCurrentMonth && "bg-secondary/10 text-muted-foreground/50"
                            )}
                        >
                            <div className={cn(
                                "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1",
                                isToday ? "bg-primary text-primary-foreground" : ""
                            )}>
                                {d.date()}
                            </div>
                            <div className="space-y-1">
                                {dayTasks.map(t => (
                                    <div 
                                        key={t.id} 
                                        className={cn(
                                            "text-[10px] truncate px-1 py-0.5 rounded border",
                                            t.status === 'DONE' ? "bg-green-500/10 border-green-500/20 text-green-600 line-through decoration-green-600/50" : "bg-primary/10 border-primary/20 text-primary-foreground"
                                        )}
                                        style={{ color: t.status !== 'DONE' ? 'inherit' : undefined }}
                                    >
                                        {t.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};