import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import {
  Content,
  ContentHeader,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { CpuGauge } from '../components/CpuGaugeComponent/CpuGaugeComponent';
import { MemoryGauge } from '../components/MemoryGaugeComponent/MemoryGaugeComponent';
import { NodeMetadataCard } from '../components/NodeMetadataCardComponent/NodeMetadataCardComponent';
import { VmTable } from '../components/VmTableComponent/VmTableComponent';
import { DisksTable } from '../components/DisksTableComponent/DisksTableComponent';
import { HasToUpdateWarning } from '../components/HasToUpdateWarningComponent/HasToUpdateWarningComponent';

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
          <Grid item xs={12}>
            <HasToUpdateWarning nodeId={nodeId} />
          </Grid>

          {/* Top Row: Summary & Health (Stays the same) */}
          <Grid item xs={12} md={4}>
            <NodeMetadataCard nodeId={nodeId} />
          </Grid>
          <Grid item xs={12} md={4}>
            <CpuGauge nodeId={nodeId} />
          </Grid>
          <Grid item xs={12} md={4}>
            <MemoryGauge nodeId={nodeId} />
          </Grid>

          {/* Middle Row: The most content-heavy table gets full width */}
          <Grid item xs={12}>
            <VmTable nodeId={nodeId} />
          </Grid>

          {/* Bottom Row: Secondary table */}
          <Grid item xs={12}>
            <DisksTable nodeId={nodeId} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};