import React from 'react';
import { Table, TableColumn, InfoCard } from '@backstage/core-components';

type Props = {
    nodeId: string;
};

export const VmTable = (props: Props) => {
    const columns: TableColumn[] = [
        { title: 'ID', field: 'vmid' },
        { title: 'Name', field: 'name' },
        { title: 'Status', field: 'status' },
    ];

    const data = [
        { vmid: 100, name: 'production-db', status: 'running' },
        { vmid: 101, name: 'auth-service', status: 'running' },
        { vmid: 102, name: 'test-runner', status: 'stopped' },
        { vmid: 103, name: 'backup-server', status: 'running' },
        { vmid: 104, name: 'dev-environment', status: 'unknown' },
    ];

    return (
        <InfoCard title="Virtual Machines (Mock)">
            <Table
                options={{ search: false, paging: false, padding: 'dense' }}
                columns={columns}
                data={data}
            />
        </InfoCard>
    );
};