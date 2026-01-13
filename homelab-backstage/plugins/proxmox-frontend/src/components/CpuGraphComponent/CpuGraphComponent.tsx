import React, { useEffect, useState } from 'react';
import {
  useApi,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useInterval from 'react-use/lib/useInterval';
import {
  InfoCard,
  Progress,
  ResponseErrorPanel,
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

interface Props {
  nodeId: string;
  vmId: number;
}

export const CpuGraph: React.FC<Props> = (props: Props) => {
  const fetchApi = useApi(fetchApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  const [state, execute] = useAsyncFn(async () => {
    const baseUrl = await discoveryApi.getBaseUrl('proxmox');
    const response = await fetchApi.fetch(
      `${baseUrl}/nodes/${props.nodeId}/vms/${props.vmId}/stats`,
    );
    const data = await response.json();

    return data.map((item: any) => ({
      ...item,
      cpuPercent: parseFloat((item.cpu * 100 * (item.maxcpu || 1)).toFixed(2)),
      formattedTime: new Date(item.time * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    }));
  }, [fetchApi, discoveryApi, props.nodeId, props.vmId]);

  useEffect(() => {
    execute();
  }, [execute]);

  useInterval(() => {
    execute();
  }, 10000);

  if (state.loading && !state.value) {
    return <Progress />;
  }

  if (state.error) {
    return <ResponseErrorPanel error={state.error} />;
  }

  return (
    <InfoCard title="CPU Usage">
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={state.value} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3f51b5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3f51b5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            
            <XAxis 
              dataKey="formattedTime" 
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
              dataKey="cpuPercent"
              stroke="#3f51b5"
              fillOpacity={1}
              fill="url(#colorCpu)"
              name="CPU Usage"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </InfoCard>
  );
};
