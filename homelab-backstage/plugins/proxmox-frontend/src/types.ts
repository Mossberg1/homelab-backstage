export type GraphPoint = {
    value: number;
    timestamp: string;
}


export type Rrddata = {
    maxmem: number;
    mem: number;
    maxdisk: number;
    maxcpu: number;
    time: number;
    diskwrite: number;
    diskread: number;
    disk: number;
    cpu: number;
    netout: number;
    netin: number;
}


export type QemuVm = {
    vmid: number;
    mem: number;
    diskwrite: number;
    status: string;
    disk: number;
    maxdisk: number;
    netin: number;
    cpu: number;
    pid: number;
    uptime: number;
    diskread: number;
    name: string;
    maxmem: number;
    cpus: number;
    netout: number;
}