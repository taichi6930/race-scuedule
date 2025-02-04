import { validateNarRaceDateTime } from '../../../../../lib/src/utility/data/nar/narRaceDateTime';

/**
 * NarRaceDateTimeのテスト
 */
describe('NarRaceDateTime', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateNarRaceDateTime(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('正常系 文字列', () => {
        const dateTime = '2021-01-01';
        const result = validateNarRaceDateTime(dateTime);
        expect(result).toStrictEqual(new Date(dateTime));
    });

    it('異常系', () => {
        const dateTime = '2021-01-500';
        expect(() => validateNarRaceDateTime(dateTime)).toThrow();
    });

    it('異常系 undefined', () => {
        const dateTime = undefined;
        expect(() => validateNarRaceDateTime(dateTime)).toThrow();
    });
});
