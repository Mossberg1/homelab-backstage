import React, { useEffect } from 'react';
import {
  MissingAnnotationEmptyState,
  useEntity,
} from '@backstage/plugin-catalog-react';
import {
  Content,
  ContentHeader,
  InfoCard,
  Page,
  Progress,
  ResponseErrorPanel,
  StructuredMetadataTable,
  SupportButton,
} from '@backstage/core-components';
import { UsageGraph } from '../components/UsageGraphComponent/UsageGraphComponent';
import {
  discoveryApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import useInterval from 'react-use/lib/useInterval';
import { GraphPoint, QemuVm, Rrddata } from '../types';
import {
  mapRrddataToCpuUsage,
  mapRrddataToMemoryUsage,
} from '../utils/mappers';
import { Grid } from '@material-ui/core';
import useAsync from 'react-use/esm/useAsync';
import { bytesToGbString, uptimeToString } from '../utils/formatting';

export const VmPage: React.FC = () => {
  const { entity } = useEntity();

  const fetchApi = useApi(fetchApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  const vmTitle = entity.metadata.title;
  const nodeId = entity.metadata.annotations?.['proxmox.io/node-id'];
  const vmId = Number(entity.metadata.annotations?.['proxmox.io/vm-id']);

  if (isNaN(vmId) || !nodeId) {
    return (
      <MissingAnnotationEmptyState
        annotation={['proxmox.io/vm-id', 'proxmox.io/node-id']}
      />
    );
  }

  // Fetch VM rrddata
  const [rrddataState, execute] = useAsyncFn(async () => {
    const baseUrl = await discoveryApi.getBaseUrl('proxmox');
    const response = await fetchApi.fetch(
      `${baseUrl}/nodes/${nodeId}/vms/${vmId}/stats`,
    );
    const data: Array<Rrddata> = await response.json();

    return data;
  }, [fetchApi, discoveryApi, nodeId, vmId]);

  useEffect(() => {
    execute();
  }, [execute]);

  useInterval(() => {
    execute();
  }, 10000);

  const rrddata = rrddataState.value ?? [];

  const cpuUsage = mapRrddataToCpuUsage(rrddata);
  const memoryUsage = mapRrddataToMemoryUsage(rrddata);

  const { value, loading, error } = useAsync(async () => {
    const baseUrl = await discoveryApi.getBaseUrl('proxmox');
    const response = await fetchApi.fetch(
      `${baseUrl}/nodes/${nodeId}/vms/${vmId}`,
    );

    const data = await response.json();
    return data as QemuVm;
  });

  return (
    <Page themeId="tool">
      <Content>
        <ContentHeader title={`${vmTitle}: ${vmId}`}>
          <SupportButton />
        </ContentHeader>

        <Grid container spacing={3}>
          {/* VM Metadata*/}
          <Grid item xs={12}>
            {error && <ResponseErrorPanel error={error} />}
            {loading || !value ? (
              <Progress />
            ) : (
              <InfoCard title="VM Metadata">
                <StructuredMetadataTable
                  metadata={{
                    Name: value.name,
                    Cores: value.cpus,
                    Memory: bytesToGbString(value.maxmem),
                    Disk: bytesToGbString(value.maxdisk),
                    Uptime: uptimeToString(value.uptime),
                    Status: value.status,
                  }}
                />
              </InfoCard>
            )}
          </Grid>

          {/* Cpu and Memory Usage Graphs */}
          <Grid item xs={12}>
            {rrddataState.error && (
              <ResponseErrorPanel error={rrddataState.error} />
            )}
            {rrddataState.loading && !rrddataState.value ? (
              <Progress />
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} xl={6}>
                  <UsageGraph title="CPU Usage" usage={cpuUsage} />
                </Grid>
                <Grid item xs={12} xl={6}>
                  <UsageGraph title="Memory Usage" usage={memoryUsage} />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
