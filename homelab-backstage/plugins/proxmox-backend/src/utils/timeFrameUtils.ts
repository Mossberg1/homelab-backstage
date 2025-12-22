import { TimeFrame } from "../services/ProxmoxApiClient";

export function parseTimeFrame(timeframe: string): TimeFrame {
    timeframe = timeframe.toLowerCase();

    switch (timeframe) {
        case "hour": {
            return TimeFrame.Hour;
        }
        case "day": {
            return TimeFrame.Day;
        }
        case "week": {
            return TimeFrame.Week;
        }
        case "month": {
            return TimeFrame.Month;
        }
        case "year": {
            return TimeFrame.Year;
        }
        case "decade": {
            return TimeFrame.Decade;
        }
    }

    return TimeFrame.Hour; // Default
}