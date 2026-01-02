import React from 'react';
import {
  Table,
  TableColumn,
  InfoCard,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import {
  useApi,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';
import { QemuVm } from '@internal/backstage-plugin-proxmox-backend/src/types';
import { bytesToGbString } from '../../utils/formatting';

type Props = {
  nodeId: string;
};

export const VmTable = (props: Props) => {
  const fetchApi = useApi(fetchApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  const { value, loading, error } = useAsync(async () => {
    const baseUrl = await discoveryApi.getBaseUrl('proxmox');
    const response = await fetchApi.fetch(
      `${baseUrl}/nodes/${props.nodeId}/vms`,
    );

    return (await response.json()) as Array<QemuVm>;
  }, [fetchApi, discoveryApi, props.nodeId]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  if (value === undefined) {
    return <ResponseErrorPanel error={new Error('value is undefined')} />;
  }

  const columns: TableColumn<QemuVm>[] = [
    { title: 'ID', field: 'vmid' },
    { title: 'Name', field: 'name' },
    { title: 'Status', field: 'status' },
    { title: 'Cores', field: 'cpus' },
    {
      title: 'Memory',
      field: 'maxmem',
      render: (row: QemuVm) => bytesToGbString(row.maxmem),
    },
  ];

  return (
    <InfoCard title="Virtual Machines">
      <Table
        options={{ search: false, paging: false, padding: 'dense' }}
        columns={columns}
        data={value}
      />
    </InfoCard>
  );
};
