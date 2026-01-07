import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { CpuGauge } from '../components/CpuGaugeComponent/CpuGaugeComponent';
import { MemoryGauge } from '../components/MemoryGaugeComponent/MemoryGaugeComponent';
import { Grid } from '@material-ui/core';
import { NodeMetadataCard } from '../components/NodeMetadataCardComponent/NodeMetadataCardComponent';
import {
  Content,
  ContentHeader,
  InfoCard,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { VmTable } from '../components/VmTableComponent/VmTableComponent';
import { DisksTable } from '../components/DisksTableComponent/DisksTableComponent';

export const NodePage: React.FC = () => {
  const { entity } = useEntity();

  const nodeId = entity.metadata.annotations?.['proxmox.io/node-id'];
  if (!nodeId) {
    return <div>No Proxmox ID found for this node.</div>;
  }

  return (
    <Page themeId="tool">
      <Content>
        <ContentHeader title={`Node: ${nodeId}`}>
          <SupportButton />
        </ContentHeader>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <NodeMetadataCard nodeId={nodeId} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CpuGauge nodeId={nodeId} />
          </Grid>
          <Grid item xs={12} md={4}>
            <MemoryGauge nodeId={nodeId} />
          </Grid>

          <Grid item xs={12} md={6}>
            <DisksTable nodeId={nodeId} />
          </Grid>

          <Grid item xs={12} md={6}>
            <VmTable nodeId={nodeId} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
