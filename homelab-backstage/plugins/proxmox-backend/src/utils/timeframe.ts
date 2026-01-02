export enum Timeframe {
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
  Decade = 'decade',
}


export function parseTimeframe(timeframe: string): Timeframe {
  timeframe = timeframe.toLowerCase();

  switch (timeframe) {
    case 'hour': {
      return Timeframe.Hour;
    }
    case 'day': {
      return Timeframe.Day;
    }
    case 'week': {
      return Timeframe.Week;
    }
    case 'month': {
      return Timeframe.Month;
    }
    case 'year': {
      return Timeframe.Year;
    }
    case 'decade': {
      return Timeframe.Decade;
    }
  }

  return Timeframe.Hour; // Default
}
