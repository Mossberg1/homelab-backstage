import { parseTimeframe, Timeframe } from './timeframe';

/***********************************************
 * Tests for parseTimeframe(timeframe: string) *
 ***********************************************/
describe('parseTimeframe', () => {
    test('hour', () => {
        const timeframe = 'hour';
        expect(parseTimeframe(timeframe)).toBe(Timeframe.Hour);
    });

    test('day', () => {
        const timeframe = 'day';
        expect(parseTimeframe(timeframe)).toBe(Timeframe.Day);
    });

    test('week', () => {
        const timeframe = 'week';
        expect(parseTimeframe(timeframe)).toBe(Timeframe.Week);
    });

    test('month', () => {
        const timeframe = 'month';
        expect(parseTimeframe(timeframe)).toBe(Timeframe.Month);
    });

    test('year', () => {
        const timeframe = 'year';
        expect(parseTimeframe(timeframe)).toBe(Timeframe.Year);
    });

    test('decade', () => {
        const timeframe = 'decade';
        expect(parseTimeframe(timeframe)).toBe(Timeframe.Decade);
    });

    test('invalid timeframe defaults to hour', () => {
        const timeframe = 'seconds';
        expect(parseTimeframe(timeframe)).toBe(Timeframe.Hour);
    });

    test('uppercase', () => {
        const timeframe = 'YEAR';
        expect(parseTimeframe(timeframe)).toBe(Timeframe.Year);
    });

    test('empty string', () => {
        const timeframe = '';
        expect(parseTimeframe(timeframe)).toBe(Timeframe.Hour);
    });

    test('whitespace', () => {
        const timeframe = '  ';
        expect(parseTimeframe(timeframe)).toBe(Timeframe.Hour);
    });
});