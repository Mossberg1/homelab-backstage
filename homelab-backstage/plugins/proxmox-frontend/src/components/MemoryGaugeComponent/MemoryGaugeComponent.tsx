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


export const MemoryGauge = (props: Props) => {
    const fetchApi = useApi(fetchApiRef);
    const discoveryApi = useApi(discoveryApiRef);
    const [memory, setMemory] = useState<number>();
    const [initialLoad, setInitialLoad] = useState<boolean>(true);

    useEffect(() => {
        const getMemUsage = async () => {
            const baseUrl = await discoveryApi.getBaseUrl('proxmox');
            const response = await fetchApi.fetch(`${baseUrl}/nodes/${props.nodeId}/mem-usage`);

            const data = await response.json();

            setMemory(data);
            setInitialLoad(false);
        }

        getMemUsage();
        const interval = setInterval(getMemUsage, 1000);

        return () => clearInterval(interval);
    }, [fetchApi, discoveryApi, props.nodeId]);

    if (initialLoad) {
        return <GaugeSkeleton />
    }

    return (<GaugeCard title='Memory Usage' inverse progress={memory ?? 0} />);
}



