import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { CpuGauge } from '../components/CpuGaugeComponent/CpuGaugeComponent';
import { MemoryGauge } from '../components/MemoryGaugeComponent/MemoryGaugeComponent';
import { Grid } from '@material-ui/core';


export const NodePage = () => {
    const { entity } = useEntity();

    const nodeId = entity.metadata.annotations?.['proxmox.io/node-id'];
    if (!nodeId) {
        return <div>No Proxmox ID found for this node.</div>
    }

    return (
        <>
            <Grid container spacing={2}>
                <Grid item>
                    <CpuGauge nodeId={nodeId}/>
                </Grid>
                <Grid item>
                    <MemoryGauge nodeId={nodeId}/>
                </Grid>
            </Grid>
        </>
    );
}