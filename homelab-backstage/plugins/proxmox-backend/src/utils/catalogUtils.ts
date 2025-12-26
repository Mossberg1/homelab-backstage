import catalogApiRef from '@backstage/plugin-catalog-backend';
import { Entity } from '@backstage/catalog-model';

export async function getNodeIdForEntity(entity: Entity): Promise<string> {
    const annotationKey = 'proxmox.io/node-id';
    const nodeId = entity.metadata.annotations?.[annotationKey];

    if (!nodeId) {
        throw new Error(`No node ID found for entity ${entity.metadata.name}`);
    } 

    return nodeId;
}