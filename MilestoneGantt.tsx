import React from 'react';
import { Milestone } from '../../../../types/neuron';
import { formatDate, cn } from '../../../../lib/utils';
import dayjs from 'dayjs';

interface MilestoneGanttProps {
    milestones: Milestone[];
    startDate: Date;
    endDate: Date;
}

export const MilestoneGantt: React.FC<MilestoneGanttProps> = ({ milestones, startDate, endDate }) => {
    const totalDays = dayjs(endDate).diff(dayjs(startDate), 'day');
    
    const getPosition = (date: Date) => {
        const diff = dayjs(date).diff(dayjs(startDate), 'day');
        return Math.max(0, Math.min(100, (diff / totalDays) * 100));
    };

    const sortedMilestones = [...milestones].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    return (
        <div className="space-y-4">
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>{formatDate(startDate)}</span>
                <span>{formatDate(endDate)}</span>
            </div>
            
            <div className="relative border-l border-r border-border bg-secondary/10 h-[300px] rounded-md overflow-hidden">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex">
                    {[0, 25, 50, 75].map(pos => (
                        <div key={pos} className="border-r border-border/30 h-full flex-1" />
                    ))}
                </div>

                {/* Milestones */}
                <div className="absolute inset-0 py-4 flex flex-col justify-evenly">
                    {sortedMilestones.map((m, idx) => {
                        const left = getPosition(m.dueDate);
                        
                        // Connector Lines (Simplified: connect to previous if dependent)
                        let connectorLine = null;
                        if (m.predecessorIds.length > 0) {
                            const pred = milestones.find(p => p.id === m.predecessorIds[0]);
                            if (pred) {
                                const predLeft = getPosition(pred.dueDate);
                                const width = left - predLeft;
                                if (width > 0) {
                                    connectorLine = (
                                        <div 
                                            className="absolute h-0.5 bg-border top-1/2 -translate-y-1/2 z-0"
                                            style={{ left: `-${width}%`, width: `${width}%` }}
                                        />
                                    );
                                }
                            }
                        }

                        return (
                            <div 
                                key={m.id} 
                                className="relative h-8"
                                style={{ left: `${left}%` }}
                            >
                                {connectorLine}
                                
                                <div className={cn(
                                    "absolute top-0 -translate-x-1/2 flex flex-col items-center group z-10 cursor-pointer",
                                    left > 90 && "-translate-x-full items-end",
                                    left < 10 && "translate-x-0 items-start"
                                )}>
                                    <div className={cn(
                                        "w-4 h-4 rotate-45 border-2 transition-colors",
                                        m.status === 'COMPLETED' ? "bg-green-500 border-green-600" :
                                        m.status === 'IN_PROGRESS' ? "bg-blue-500 border-blue-600" :
                                        "bg-card border-muted-foreground"
                                    )} />
                                    
                                    <div className="mt-1 text-[10px] font-medium bg-card/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-border whitespace-nowrap shadow-sm opacity-80 group-hover:opacity-100 group-hover:z-50 transition-all">
                                        {m.title} ({dayjs(m.dueDate).format('MM/DD')})
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Current Time Indicator */}
                <div 
                    className="absolute top-0 bottom-0 border-l-2 border-red-500 z-0 opacity-50"
                    style={{ left: `${getPosition(new Date())}%` }}
                />
            </div>
        </div>
    );
};
