import { WarningPanel } from "@backstage/core-components";
import {
  useApi,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';

interface Props {
    nodeId: string;
}

export const HasToUpdateWarning = (props: Props) => {
    const fetchApi = useApi(fetchApiRef);
    const discoveryApi = useApi(discoveryApiRef);

    const { value, loading, error } = useAsync(async () => { 
        const baseUrl = await discoveryApi.getBaseUrl('proxmox');
        const response = await fetchApi.fetch(`${baseUrl}/nodes/${props.nodeId}/needs-update`);

        return response.json();
    }, [fetchApi, discoveryApi]);

    console.log(value);

    if (loading) {
        return null;
    }

    if (error || !value) { 
        return null;
    }

    if (value === false) {
        return null;
    }

    return (
        <WarningPanel
            title="Update Required"
            message={
                `Node ${props.nodeId} has to be updated.`
            }
        />
    );
}