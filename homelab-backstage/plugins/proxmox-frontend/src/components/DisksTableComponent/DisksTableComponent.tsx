import {
  Progress,
  ResponseErrorPanel,
  StatusError,
  StatusOK,
  StatusWarning,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { NodeDisk } from '@internal/backstage-plugin-proxmox-backend/src/types';
import { bytesToGbString } from '../../utils/formatting';
import { Chip } from '@material-ui/core';
import {
  discoveryApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';

interface Props {
  nodeId: string;
}

const cols: TableColumn<NodeDisk>[] = [
  {
    title: 'Device',
    field: 'devpath',
    highlight: true,
  },
  {
    title: 'Model',
    field: 'model',
    render: row => `${row.vendor || ''} ${row.model || ''}`,
  },
  {
    title: 'Size',
    field: 'size',
    render: row => bytesToGbString(row.size),
  },
  {
    title: 'Usage',
    field: 'used',
    render: row => (
      <Chip label={row.used || 'Unused'} size="small" variant="outlined" />
    ),
  },
  {
    title: 'Health',
    field: 'health',
    render: row => {
      const status = row.health?.toLowerCase();

      if (status === 'passed' || status === 'ok') {
        return <StatusOK>OK</StatusOK>;
      }
      if (status === 'unknown') {
        return <StatusWarning>Unknown</StatusWarning>;
      }

      return <StatusError>{row.health}</StatusError>;
    },
  },
  {
    title: 'Serial',
    field: 'serial',
    hidden: true,
  },
];

export const DisksTable = (props: Props) => {
  const fetchApi = useApi(fetchApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  const { value, loading, error } = useAsync(async () => {
    const baseUrl = await discoveryApi.getBaseUrl('proxmox');
    const response = await fetchApi.fetch(
      `${baseUrl}/nodes/${props.nodeId}/disks`,
    );

    return response.json();
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

  return (
    <Table
      title="Disks"
      options={{ search: false, paging: false }}
      columns={cols}
      data={value}
    />
  );
};
