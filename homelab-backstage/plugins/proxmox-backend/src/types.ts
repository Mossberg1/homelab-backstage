export type ProxmoxNode = {
    status: string;
    level: string;
    disk: number;
    uptime: number;
    ssl_fingerprint: string;
    node: string;
    id: string;
    cpu: number;
    mem: number;
    maxmem: number;
    maxcpu: number;
    maxdisk: number;
    type: string;
}


export type Swap = {
    used: number;
    free: number;
    total: number;
}


export type Memory = {
    free: number;
    used: number;
    total: number;
}


export type RootFs = {
    avail: number;
    free: number;
    used: number;
    total: number;
}


export type CurrentKernel = {
    machine: string;
    release: string;
    sysname: string;
    version: string;
}


export type Ksm = {
    shared: number;
}


export type BootInfo = {
    secureboot: number;
    mode: string;
}


export type CpuInfo = {
    cpus: number;
    cores: number;
    sockets: number;
    flags: string;
    model: string;
    mhz: string;
    hvm: string;
    user_hz: number;
}


export type ProxmoxNodeStatus = {
    swap: Swap;
    memory: Memory;
    rootfs: RootFs;
    'current-kernel': CurrentKernel;
    idle: number;
    ksm: Ksm;
    cpu: number;
    uptime: number;
    wait: number;
    kversion: string;
    'boot-info': BootInfo;
    cpuinfo: CpuInfo;
    pveversion: string;
    loadavg: Array<string>;
}


export type ProxmoxNodeStats = {
    memtotal: number;
    netout: number;
    iowait: number;
    maxcpu: number;
    cpu: number;
    time: number;
    swaptotal: number;
    swapused: number;
    roottotal: number;
    loadavg: number;
    netin: number;
    rootused: number;
    memused: number;
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


export type NodeDisk = {
    devpath: string;
    gpt: boolean;
    mounted: boolean;
    osdid: number;
    "osdid-list": Array<number>;
    size: number;
    health: string;
    model: string;
    parent: string;
    serial: string;
    used: string;
    vendor: string;
    wwn: string;
}