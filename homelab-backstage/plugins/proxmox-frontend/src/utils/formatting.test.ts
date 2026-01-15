import { uptimeToString, bytesToGbString, formatTimestamp } from './formatting';

/********************************************
 * Tests for bytesToGbString(bytes: number) *
 ********************************************/
describe('bytesToGbString', () => {
  const oneGb = 1024 * 1024 * 1024;

  test('removes trailing zeros for whole numbers', () => {
    const gb = bytesToGbString(oneGb * 4.0);
    expect(gb).toBe('4 GB');
  });

  test('rounds to one decimal place', () => {
    const gb = bytesToGbString(3.9335 * oneGb);
    expect(gb).toBe('3.9 GB');
  });

  test('handles zero bytes', () => {
    const gb = bytesToGbString(0);
    expect(gb).toBe('0 GB');
  });

  test('negative bytes', () => {
    const gb = bytesToGbString(-10);
    expect(gb).toBe('0 GB');
  });
});

/*********************************************
 * Tests for uptimeToString(seconds: number) *
 *********************************************/
describe('uptimeToString', () => {
  test('Test only minutes', () => {
    const seconds = 120;
    expect(uptimeToString(seconds)).toBe('2m');
  });

  test('Test hours and minutes', () => {
    const seconds = 3600 + 120;
    expect(uptimeToString(seconds)).toBe('1h 2m');
  });

  test('Test days, hours, and minutes', () => {
    const seconds = 86400 + 3600 + 60;
    expect(uptimeToString(seconds)).toBe('1d 1h 1m');
  });

  test('Handles 0 seconds', () => {
    const seconds = 0;
    expect(uptimeToString(seconds)).toBe('0m');
  });

  test('Handles negative seconds', () => {
    const seconds = -10;
    expect(uptimeToString(seconds)).toBe('0m');
  });
});

/***********************************************
 * Tests for formatTimestamp(unixtime: number) *
 ***********************************************/
describe('formatTimestamp', () => {
  const orginalTimezone = process.env.TZ;

  beforeAll(() => {
    process.env.TZ = 'UTC';
  });

  afterAll(() => {
    process.env.TZ = orginalTimezone;
  });
  
  test('Formats a known timestamp correctly', () => {
    const unixtime = 1768335661;
    expect(formatTimestamp(unixtime)).toEqual('08:21:01 PM')
  });

  test('Handles epoch time', () => {
    const unixtime = 0;
    expect(formatTimestamp(unixtime)).toEqual('12:00:00 AM');
  });

  test('Handles negative unixtime', () => {
    const unixtime = -1000;
    expect(formatTimestamp(unixtime)).toEqual('11:43:20 PM');
  });

  test('Handles NaN', () => {
    const unixtime = NaN;
    expect(formatTimestamp(unixtime)).toEqual('Invalid Date');
  });
});