import { useState, useEffect } from 'react';
import { GaugeCard } from "@backstage/core-components";
import {
    useApi,
    discoveryApiRef,
    fetchApiRef,
} from '@backstage/core-plugin-api';
import { GaugeSkeleton } from "../GaugeSkeletonComponent/GaugeSkeletonComponent";


type Props = {
    nodeId: string;
}


export const CpuGauge = (props: Props) => {
    const fetchApi = useApi(fetchApiRef);
    const discoveryApi = useApi(discoveryApiRef);
    const [cpu, setCpu] = useState<number>();
    const [initialLoad, setInitialLoad] = useState<boolean>(true);

    useEffect(() => {
        const getCpuUsage = async () => {
            const baseUrl = await discoveryApi.getBaseUrl('proxmox');
            const response = await fetchApi.fetch(`${baseUrl}/nodes/${props.nodeId}/cpu-usage`);

            const data = await response.json();

            setCpu(data);
            setInitialLoad(false);
        }

        getCpuUsage();
        const interval = setInterval(getCpuUsage, 1000);

        return () => clearInterval(interval);
    }, [fetchApi, discoveryApi, props.nodeId]);

    if (initialLoad) {
        return <GaugeSkeleton />
    }

    return (<GaugeCard title='CPU Usage' inverse progress={cpu ?? 0} />);
}