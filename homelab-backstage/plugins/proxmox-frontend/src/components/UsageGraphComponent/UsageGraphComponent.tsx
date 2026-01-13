import React from 'react';
import {
  InfoCard,
} from '@backstage/core-components';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { GraphPoint } from '../../types';

interface Props {
  title: string;
  usage: Array<GraphPoint>;
}

const GRAPH_COLOR = "#3f51b5"

export const UsageGraph: React.FC<Props> = (props: Props) => {
  return (
    <InfoCard title={props.title}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={props.usage} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={GRAPH_COLOR} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={GRAPH_COLOR} stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            
            <XAxis 
              dataKey="timestamp" 
              minTickGap={30}
              tick={{ fontSize: 12, fill: '#666' }} 
            />
            
            <YAxis 
              unit="%" 
              domain={[0, 100]} 
              tick={{ fontSize: 12, fill: '#666' }} 
            />
            
            <Tooltip />
            
            <Area
              isAnimationActive={false}
              type="monotone"
              dataKey="value"
              stroke={GRAPH_COLOR}
              fillOpacity={1}
              fill="url(#color)"
              name={'Usage (%)'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </InfoCard>
  );
};
