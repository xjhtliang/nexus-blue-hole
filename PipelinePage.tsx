import React from 'react';
import { useCrmStore } from '../../../store/useCrmStore';
import { PipelineBoard } from '../components/PipelineBoard';

export const PipelinePage: React.FC = () => {
    const { opportunities, moveOpportunityStage, isLoading } = useCrmStore();

    if (isLoading && opportunities.length === 0) {
         return <div className="p-8 text-center text-sm">Loading pipeline...</div>
    }

    return (
        <div className="h-full">
            <PipelineBoard 
                opportunities={opportunities} 
                onDragEnd={(id, stage) => moveOpportunityStage(id, stage)} 
            />
        </div>
    );
};
