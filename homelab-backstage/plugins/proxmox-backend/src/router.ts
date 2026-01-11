import express from 'express';
import Router from 'express-promise-router';
import { Config } from '@backstage/config';
import {
  ProxmoxApiClient,
  ProxmoxApiClientOptions,
} from './services/ProxmoxApiClient';
import { parseTimeframe } from './utils/timeframe';

function createProxmoxApiClient(config: Config): ProxmoxApiClient {
  const options: ProxmoxApiClientOptions = {
    host: config.getString('proxmox.host'),
    port: config.getNumber('proxmox.port'),
    user: config.getString('proxmox.user'),
    realm: config.getString('proxmox.realm'),
    tokenId: config.getString('proxmox.tokenId'),
    tokenSecret: config.getString('proxmox.tokenSecret'),
  };

  return new ProxmoxApiClient(options);
}

export async function createRouter({
  config,
}: {
  config: Config;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  const proxmoxApi = createProxmoxApiClient(config);

  router.get('/nodes', async (_, res) => {
    const nodes = await proxmoxApi.getNodes();

    return res.json(nodes);
  });

  router.get('/nodes/:nodeId', async (req, res) => {
    const nodeId = req.params.nodeId;

    const node = await proxmoxApi.getNodeStatus(nodeId);

    return res.json(node);
  });

  router.get('/nodes/:nodeId/cpu-usage', async (req, res) => {
    const nodeId = req.params.nodeId;

    const cpu = await proxmoxApi.getNodeCpuUsage(nodeId);

    return res.json(cpu);
  });

  router.get('/nodes/:nodeId/disks', async (req, res) => {
    const nodeId = req.params.nodeId;
    const disks = await proxmoxApi.getNodeDisks(nodeId);

    return res.json(disks);
  });

  router.get('/nodes/:nodeId/mem-usage', async (req, res) => {
    const nodeId = req.params.nodeId;

    const memory = await proxmoxApi.getNodeMemoryUsage(nodeId);

    return res.json(memory);
  });

  router.get('/nodes/:nodeId/stats', async (req, res) => {
    const nodeId = req.params.nodeId;
    const timeframeParam = req.query.timeframe?.toString() || 'hour';
    const timeframe = parseTimeframe(timeframeParam);

    const stats = await proxmoxApi.getNodeStats(nodeId, timeframe);

    return res.json(stats);
  });

  router.get('/nodes/:nodeId/needs-update', async (req, res) => {
    const nodeId = req.params.nodeId;
    const hasToUpdate = await proxmoxApi.nodeHasToUpdate(nodeId);

    return res.json(hasToUpdate);
  });

  router.get('/nodes/:nodeId/vms', async (req, res) => {
    const nodeId = req.params.nodeId;

    const vms = await proxmoxApi.getNodeVms(nodeId);

    return res.json(vms);
  });

  router.get('/nodes/:nodeId/vms/:vmId', async (req, res) => {
    const nodeId = req.params.nodeId;
    const vmId = Number(req.params.vmId);

    let osinfo = null;

    try {
      osinfo = await proxmoxApi.getVmOsInfo(nodeId, vmId);
    } catch (error) {
      return res.json(error);
    }
    return res.json(osinfo);
  });

  return router;
}
