import { ProxmoxNode, ProxmoxNodeStatus, ProxmoxNodeStats } from '../types';


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export type ProxmoxApiClientOptions = {
    host: string;
    port: number;
    user: string;
    realm: string;
    tokenId: string;
    tokenSecret: string;
}

export enum TimeFrame {
    Hour = "hour",
    Day = "day",
    Week = "week",
    Month = "month",
    Year = "year",
    Decade = "decade"
}

export class ProxmoxApiClient {
    private readonly _baseUrl: string;
    private readonly _authHeader: string;

    constructor(opt: ProxmoxApiClientOptions) {
        this._baseUrl = `https://${opt.host}:${opt.port}/api2/json`
        this._authHeader = `PVEAPIToken=${opt.user}@${opt.realm}!${opt.tokenId}=${opt.tokenSecret}`;
    }

    async getNodes(): Promise<Array<ProxmoxNode>> {
        const res = await fetch(`${this._baseUrl}/nodes`, {
            headers: {
                "Authorization": this._authHeader
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


    async getNodeMemoryUsage(id: string): Promise<Number> {
        const nodeStatus = await this.getNodeStatus(id);
        return this.calculateMemoryUsage(nodeStatus);
    }


    async getNodeStatus(id: string): Promise<ProxmoxNodeStatus> {
        const res = await fetch(`${this._baseUrl}/nodes/${id}/status/`, {
            headers: {
                "Authorization": this._authHeader
            }
        });

        if (!res.ok) {
            throw new Error(`Proxmox API error: ${res.statusText}`);
        }

        const json = await res.json();
        return json.data as ProxmoxNodeStatus;
    }


    async getNodeStats(id: string, timeframe: TimeFrame = TimeFrame.Hour): Promise<Array<ProxmoxNodeStats>> {
        const res = await fetch(`${this._baseUrl}/nodes/${id}/rrddata?timeframe=${timeframe}`, {
            headers: {
                "Authorization": this._authHeader
            }
        });

        if (!res.ok) {
            throw new Error(`Proxmox API error: ${res.statusText}`);
        }

        const json = await res.json();
        return json.data as Array<ProxmoxNodeStats>;
    }


    private calculateMemoryUsage(nodeStatus: ProxmoxNodeStatus) {
        const used = nodeStatus.memory.used;
        const total = nodeStatus.memory.total;

        return (used / total);
    }
}