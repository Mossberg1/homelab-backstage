import {
  ProxmoxNode,
  ProxmoxNodeStatus,
  ProxmoxNodeStats,
  QemuVm,
  NodeDisk,
  Rrddata,
} from '../types';
import { Timeframe } from '../utils/timeframe';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export type ProxmoxApiClientOptions = {
  host: string;
  port: number;
  user: string;
  realm: string;
  tokenId: string;
  tokenSecret: string;
};

export class ProxmoxApiClient {
  private readonly _baseUrl: string;
  private readonly _authHeader: string;

  constructor(opt: ProxmoxApiClientOptions) {
    this._baseUrl = `https://${opt.host}:${opt.port}/api2/json`;
    this._authHeader = `PVEAPIToken=${opt.user}@${opt.realm}!${opt.tokenId}=${opt.tokenSecret}`;
  }

  async getNodes(): Promise<Array<ProxmoxNode>> {
    const res = await fetch(`${this._baseUrl}/nodes`, {
      headers: {
        Authorization: this._authHeader,
      },
    });

    if (!res.ok) {
      throw new Error(`Proxmox API error: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data as Array<ProxmoxNode>;
  }

  async getNodeCpuUsage(id: string): Promise<Number> {
    const nodeStatus = await this.getNodeStatus(id);
    return nodeStatus.cpu;
  }

  async getNodeDisks(id: string): Promise<Array<NodeDisk>> {
    const res = await fetch(`${this._baseUrl}/nodes/${id}/disks/list`, {
      headers: {
        Authorization: this._authHeader,
      },
    });

    if (!res.ok) {
      throw new Error(`Proxmox API error: ${res.statusText}`);
    }

    const json = await res.json();

    return json.data as Array<NodeDisk>;
  }

  async getNodeMemoryUsage(id: string): Promise<Number> {
    const nodeStatus = await this.getNodeStatus(id);
    return this.calculateMemoryUsage(nodeStatus);
  }

  async getNodeStatus(id: string): Promise<ProxmoxNodeStatus> {
    const res = await fetch(`${this._baseUrl}/nodes/${id}/status/`, {
      headers: {
        Authorization: this._authHeader,
      },
    });

    if (!res.ok) {
      throw new Error(`Proxmox API error: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data as ProxmoxNodeStatus;
  }

  async getNodeStats(
    id: string,
    timeframe: Timeframe = Timeframe.Hour,
  ): Promise<Array<ProxmoxNodeStats>> {
    const res = await fetch(
      `${this._baseUrl}/nodes/${id}/rrddata?timeframe=${timeframe}`,
      {
        headers: {
          Authorization: this._authHeader,
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Proxmox API error: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data as Array<ProxmoxNodeStats>;
  }

  async getNodeVms(id: string): Promise<Array<QemuVm>> {
    const res = await fetch(`${this._baseUrl}/nodes/${id}/qemu`, {
      headers: {
        Authorization: this._authHeader,
      },
    });

    if (!res.ok) {
      throw new Error(`Proxmox API error: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data as Array<QemuVm>;
  }

  async nodeHasToUpdate(id: string): Promise<boolean> {
    const res = await fetch(`${this._baseUrl}/nodes/${id}/apt/update`, {
      headers: {
        Authorization: this._authHeader,
      },
    });

    if (!res.ok) {
      throw new Error(`Proxmox API error: ${res.statusText}`);
    }

    const json = await res.json();

    if (Array.isArray(json.data) && json.data.length > 0) {
      return true;
    }

    return false;
  }

  async getVm(nodeId: string, vmId: number): Promise<QemuVm | null> {
    const res = await fetch(`${this._baseUrl}/nodes/${nodeId}/qemu`, {
      headers: {
        Authorization: this._authHeader
      }
    });

    if (!res.ok) {
      throw new Error(`Proxmox API error: ${res.statusText}`);
    }

    const result = await res.json();
    const vms: Array<QemuVm> = result.data;

    return vms.find(v => v.vmid === vmId) ?? null;
  }

  async getVmOsInfo(nodeId: string, vmId: number): Promise<any> {
    const res = await fetch(`${this._baseUrl}/nodes/${nodeId}/qemu/${vmId}/agent/get-osinfo`,{
      headers: {
        Authorization: this._authHeader
      }
    });

    if (!res.ok) {
      throw new Error(`Proxmox API error: ${res.statusText}`);
    }

    const json = await res.json();
    return json.data;
  }

  async getVmStats(nodeId: string, vmId: number, timeframe: Timeframe = Timeframe.Hour): Promise<Array<Rrddata>> {
    const res = await fetch(`${this._baseUrl}/nodes/${nodeId}/qemu/${vmId}/rrddata?timeframe=${timeframe}`, {
      headers: {
        Authorization: this._authHeader
      }
    });

    if (!res.ok) {
      throw new Error(`Proxmox API error: ${res.statusText}`);
    }

    const json = await res.json();

    return json.data;
  }

  private calculateMemoryUsage(nodeStatus: ProxmoxNodeStatus) {
    const used = nodeStatus.memory.used;
    const total = nodeStatus.memory.total;

    return used / total;
  }
}
