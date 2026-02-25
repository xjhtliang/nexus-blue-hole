import React from 'react';
import { LifeBalanceMetric } from '../../../types/rightBrain';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface LifeWheelProps {
    data: LifeBalanceMetric[];
}

export const LifeWheel: React.FC<LifeWheelProps> = ({ data }) => {
    return (
        <div className="h-[300px] w-full flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                        dataKey="dimension" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar
                        name="Life Balance"
                        dataKey="score"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="#10b981"
                        fillOpacity={0.3}
                    />
                    <Tooltip 
                         contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                         itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                </RadarChart>
             </ResponsiveContainer>
             
             {/* Score Overlay */}
             <div className="absolute top-2 right-2 text-xs text-muted-foreground">
                 Avg: {(data.reduce((a, b) => a + b.score, 0) / data.length).toFixed(1)} / 10
             </div>
        </div>
    );
};