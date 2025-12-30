import { InfoCard } from '@backstage/core-components';
import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';


export const NodePage = () => {
    const { entity } = useEntity();

    const nodeId = entity.metadata.annotations?.['proxmox.io/node-id'];
    if (!nodeId) {
        return <div>No Proxmox ID found for this node.</div>
    }

    return (
        <>
            <InfoCard title={`Proxmox Node: ${nodeId}`}>    
            </InfoCard>
        </>
    );
}