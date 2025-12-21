import express from 'express';
import Router from 'express-promise-router';
import { Config } from '@backstage/config';
import { ProxmoxApiClient, ProxmoxApiClientOptions } from './services/ProxmoxApiClient';

function createProxmoxApiClient(config: Config): ProxmoxApiClient {
  const options: ProxmoxApiClientOptions = {
    host: config.getString('proxmox.host'),
    port: config.getNumber('proxmox.port'),
    user: config.getString('proxmox.user'),
    realm: config.getString('proxmox.realm'),
    tokenId: config.getString('proxmox.tokenId'),
    tokenSecret: config.getString('proxmox.tokenSecret')
  }

  return new ProxmoxApiClient(options);
}

export async function createRouter({
  config,
}: {
  config: Config
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  const proxmoxApi = createProxmoxApiClient(config);

  router.get('/nodes', async (_, res) => {
    const nodes = await proxmoxApi.getNodes();
    return res.json(nodes);
  });

  return router;
}
