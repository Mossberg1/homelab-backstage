process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export type ProxmoxApiClientOptions = {
    host: string;
    port: number;
    user: string;
    realm: string;
    tokenId: string;
    tokenSecret: string;
}

export class ProxmoxApiClient {
    private readonly _baseUrl: string;
    private readonly _authHeader: string;

    constructor(opt: ProxmoxApiClientOptions) {
        this._baseUrl = `https://${opt.host}:${opt.port}/api2/json`
        this._authHeader = `PVEAPIToken=${opt.user}@${opt.realm}!${opt.tokenId}=${opt.tokenSecret}`;
    }

    async getNodes(): Promise<any> {
        const res = await fetch(`${this._baseUrl}/nodes`, {
            headers: {
                "Authorization": this._authHeader
            },
        });

        if (!res.ok) {
            throw new Error(`Proxmox API error: ${res.statusText}`);
        }

        const json = await res.json();
        return json.data;
    }
}