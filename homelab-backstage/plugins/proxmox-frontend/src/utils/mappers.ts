import { GraphPoint, Rrddata } from "../types";
import { formatTimestamp } from "./formatting";

export function mapRrddataToCpuUsage(data: Array<Rrddata>): Array<GraphPoint> {
    return data.map((rrddata: Rrddata) => ({
        value: parseFloat((rrddata.cpu * 100).toFixed(2)),
        timestamp: formatTimestamp(rrddata.time),
    }));
}


export function mapRrddataToMemoryUsage(data: Array<Rrddata>): Array<GraphPoint> {
    return data.map((rrddata: Rrddata) => ({
        value: parseFloat((rrddata.mem / rrddata.maxmem * 100).toFixed(2)),
        timestamp: formatTimestamp(rrddata.time)
    }));
}