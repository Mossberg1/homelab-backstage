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