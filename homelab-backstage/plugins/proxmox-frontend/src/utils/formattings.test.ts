import { uptimeToString } from "./formatting";

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