import { InfoCard, Progress, ResponseErrorPanel, StructuredMetadataTable } from '@backstage/core-components';
import {
    useApi,
    discoveryApiRef,
    fetchApiRef
} from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { uptimeToString } from '../../utils/formatting';


type Props = {
    nodeId: string;
};


export const NodeMetadataCard = (props: Props) => {
    const fetchApi = useApi(fetchApiRef);
    const discoveryApi = useApi(discoveryApiRef);

    const { value, loading, error } = useAsync(async () => {
        const baseUrl = await discoveryApi.getBaseUrl('proxmox');
        const response = await fetchApi.fetch(`${baseUrl}/nodes/${props.nodeId}`);
        console.log(response);
        return response.json();
    }, [fetchApi, discoveryApi, props.nodeId]);

    if (loading) {
        return <Progress />
    }

    if (error) {
        return <ResponseErrorPanel error={error}/>
    }

    const metadata = {
        'CPU Model': value.cpuinfo.model || 'Unknown',
        'Kernel': value['current-kernel'].release || 'Unknown',
        'PVE Version': value.pveversion || 'Unknown',
        'Uptime': uptimeToString(value.uptime || 0)
    };

    return (
        <InfoCard title='Node Metadata'>
            <StructuredMetadataTable metadata={metadata}/>
        </InfoCard>
    );
}