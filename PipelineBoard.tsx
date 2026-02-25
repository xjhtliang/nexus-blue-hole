import React from 'react';
import { Opportunity, OpportunityStage } from '../../../types/crm';
import { useDroppable, useDraggable, DndContext, DragEndEvent } from '@dnd-kit/core';
import { cn, formatCurrency } from '../../../lib/utils';
import dayjs from 'dayjs';

const STAGES: { id: OpportunityStage; label: string }[] = [
    { id: 'DISCOVERY', label: 'Discovery' },
    { id: 'PROPOSAL', label: 'Proposal' },
    { id: 'NEGOTIATION', label: 'Negotiation' },
    { id: 'CLOSED_WON', label: 'Closed Won' },
    { id: 'CLOSED_LOST', label: 'Closed Lost' },
];

interface PipelineBoardProps {
    opportunities: Opportunity[];
    onDragEnd: (id: string, newStage: string) => void;
}

const DraggableCard = ({ opp }: { opp: Opportunity }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: opp.id,
    });
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="bg-card border border-border p-3 rounded-lg shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing mb-3"
        >
            <div className="font-medium text-sm mb-1">{opp.name}</div>
            <div className="flex justify-between items-center mb-2">
                 <span className="text-xs text-muted-foreground">{opp.leadCompany}</span>
                 <span className="text-xs font-semibold text-primary">{formatCurrency(opp.amount)}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-muted-foreground bg-secondary/30 p-1 rounded">
                <span>Prob: {opp.probability}%</span>
                <span>{dayjs(opp.expectedCloseDate).format('MMM DD')}</span>
            </div>
        </div>
    );
};

const DroppableColumn = ({ id, label, items }: { id: string, label: string, items: Opportunity[] }) => {
    const { setNodeRef } = useDroppable({ id });

    const totalValue = items.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div ref={setNodeRef} className="flex-1 min-w-[250px] bg-secondary/20 rounded-xl p-2 flex flex-col h-full border border-transparent hover:border-border/50 transition-colors">
            <div className="flex justify-between items-center mb-3 px-2">
                <span className="font-semibold text-sm text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground bg-secondary rounded px-1.5 py-0.5">{items.length}</span>
            </div>
            <div className="text-xs text-muted-foreground px-2 mb-3">
                {formatCurrency(totalValue)}
            </div>
            <div className="flex-1 overflow-y-auto px-1 scrollbar-hide">
                {items.map(opp => (
                    <DraggableCard key={opp.id} opp={opp} />
                ))}
            </div>
        </div>
    );
};

export const PipelineBoard: React.FC<PipelineBoardProps> = ({ opportunities, onDragEnd }) => {
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            // Find which column is 'over'
            // In a real dnd-kit setup with SortableContext, this is more complex.
            // Here, we assume the droppable ID is the stage ID.
            onDragEnd(active.id as string, over.id as string);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full overflow-x-auto pb-4">
                {STAGES.map(stage => (
                    <DroppableColumn 
                        key={stage.id} 
                        id={stage.id} 
                        label={stage.label} 
                        items={opportunities.filter(o => o.stage === stage.id)} 
                    />
                ))}
            </div>
        </DndContext>
    );
};