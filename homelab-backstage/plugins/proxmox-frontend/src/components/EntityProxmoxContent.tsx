import React from 'react';
import { EntitySwitch } from '@backstage/plugin-catalog';
import { NodePage } from '../pages/NodePage';


export const EntityProxmoxContent = () => {
    return (
        <EntitySwitch>
            <EntitySwitch.Case if={entity =>
                    entity.kind === 'Resource' &&
                    entity.metadata.annotations?.['proxmox.io/type'] === 'node'
            }>
                <NodePage />
            </EntitySwitch.Case>
        </EntitySwitch>
    );
}