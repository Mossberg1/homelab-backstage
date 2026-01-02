export function bytesToGbString(bytes: number): string {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${parseFloat(gb.toFixed(1))} GB`;
}


export function uptimeToString(seconds: number): string {
    if (seconds <= 0) {
        return '0m';
    }

    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const uptime = Array<String>();

    if (days > 0) {
        uptime.push(`${days}d`);
    }
    if (hours > 0) {
        uptime.push(`${hours}h`);
    }
    
    uptime.push(`${minutes}m`);

    return uptime.join(' ');
}