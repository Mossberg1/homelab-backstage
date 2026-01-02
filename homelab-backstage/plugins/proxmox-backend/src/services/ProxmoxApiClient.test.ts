import { ProxmoxApiClient, ProxmoxApiClientOptions } from './ProxmoxApiClient';
import { Timeframe } from '../utils/timeframe';
import { ProxmoxNode, ProxmoxNodeStats, ProxmoxNodeStatus } from '../types';


// Mock fetch()
const fetchMock = jest.fn();
global.fetch = fetchMock;

const mockProxmoxNode: ProxmoxNode = {
    status: 'online',
    level: '',
    disk: 5,
    uptime: 3600,
    ssl_fingerprint: 'test-ssl_fingerprint',
    node: 'pve1', 
    id: 'node/pve1',
    cpu: 5,
    mem: 5,
    maxmem: 10,
    maxcpu: 10,
    maxdisk: 10,
    type: 'node'
};

const mockProxmoxNodeStatus: ProxmoxNodeStatus = {
    swap: {
        used: 0,
        free: 100,
        total: 100
    },
    memory: {
        free: 6,
        used: 4,
        total: 10
    },
    rootfs: {
        avail: 5,
        free: 6,
        used: 4,
        total: 10
    },
    'current-kernel': {
        machine: 'test-machine',
        release: 'test-release',
        sysname: 'test-sysname',
        version: 'test-version'
    },
    idle: 0,
    ksm: { shared: 0 },
    cpu: 0.1,
    uptime: 3600,
    wait: 0,
    kversion: 'test-kversion',
    'boot-info': {
        secureboot: 0,
        mode: 'test-mode'
    },
    cpuinfo: {
        cpus: 10,
        cores: 5,
        sockets: 1,
        flags: 'test-flags',
        model: 'test-model',
        mhz: 'test-mhz',
        hvm: 'test-hvm',
        user_hz: 100
    },
    pveversion: 'test-pveversion',
    loadavg: ['0.9', '0.8', '0.7']
};

const mockProxmoxNodeStats: ProxmoxNodeStats = {
    memtotal: 0,
    netout: 0,
    iowait: 0,
    maxcpu: 0,
    cpu: 0,
    time: 0,
    swaptotal: 0,
    swapused: 0,
    roottotal: 0,
    loadavg: 0,
    netin: 0,
    rootused: 0,
    memused: 0
};


describe('ProxmoxApiClient', () => {
    let client: ProxmoxApiClient;

    const options: ProxmoxApiClientOptions = {
        host: 'proxmox.local',
        port: 8006,
        user: 'root',
        realm: 'pam',
        tokenId: 'test-id',
        tokenSecret: 'test-secret'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        client = new ProxmoxApiClient(options);
    });

    describe('getNodes', () => {
        test('returns the list of nodes on success', async () => {
            const mockData = new Array<ProxmoxNode>(mockProxmoxNode);

            fetchMock.mockResolvedValue({
                ok: true,
                json: async () => ({ data: mockData })
            });

            const res = await client.getNodes();
            expect(res).toEqual(mockData);
        });

        test('throws error when API response is not OK', async () => {
            fetchMock.mockResolvedValue({
                ok: false,
            });

            expect(client.getNodes()).rejects.toThrow();
        });
    });

    describe('getNodeCpuUsage', () => {
        const nodeId = 'pve1'

        test('Retrives CPU usage for Node on success', async () => {
            const expectedCpuUsage = mockProxmoxNodeStatus.cpu;

            fetchMock.mockResolvedValue({
                ok: true,
                json: async () => ({ data: mockProxmoxNodeStatus })
            });

            const cpuUsage = await client.getNodeCpuUsage(nodeId);

            expect(cpuUsage).toBe(expectedCpuUsage);
        });
    });

    describe('getNodeMemoryUsage', () => {
        const nodeId = 'pve1'

        test('retrives and calculates memory usage correctly for a node on success', async () => {
            const used = mockProxmoxNodeStatus.memory.used;
            const total = mockProxmoxNodeStatus.memory.total;
            const expectedMemoryUsage = used / total;

            fetchMock.mockResolvedValue({
                ok: true,
                json: async () => ({ data: mockProxmoxNodeStatus })
            });

            const memoryUsage = await client.getNodeMemoryUsage(nodeId)

            expect(memoryUsage).toBe(expectedMemoryUsage);
        });
    });

    describe('getNodeStatus', () => {
        const nodeId = 'pve1';

        test('retrives ProxmoxNodeStatus on success', async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                json: async () => ({ data: mockProxmoxNodeStatus })
            });

            const status = await client.getNodeStatus(nodeId);

            expect(status).toBe(mockProxmoxNodeStatus);
        });

        test('throws when API response is not OK', async () => {
            fetchMock.mockResolvedValue({ ok: false });
            expect(client.getNodeStatus(nodeId)).rejects.toThrow();
        });
    });

    describe('getNodeStats', () => {
        const nodeId = 'pve1';

        test('returns a Array<ProxmoxNodeStats> on success', async () => {
            const mockData = new Array<ProxmoxNodeStats>(mockProxmoxNodeStats);

            fetchMock.mockResolvedValue({
                ok: true,
                json: async () => ({ data: mockData })
            });

            const response = await client.getNodeStats(nodeId);

            expect(response).toEqual(mockData);
        });

        test('throws if API response is not OK', async () => {
            fetchMock.mockResolvedValue({ ok: false });
            expect(client.getNodeStats(nodeId)).rejects.toThrow();
        });

        test('timeframe is applied correctly to URL', async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                json: async () => ({ data: [] })
            });

            await client.getNodeStats(nodeId, Timeframe.Week);

            expect(fetchMock).toHaveBeenCalledWith(
                expect.stringContaining('timeframe=week'),
                expect.anything()
            );
        });
    });
});