import { validateNarRaceDate } from '../../../../../lib/src/utility/data/nar/narRaceDate';

/**
 * NarRaceDateのテスト
 */
describe('NarRaceDate', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateNarRaceDate(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('異常系', () => {
        const dateTime = '2021-01-01';
        expect(() => validateNarRaceDate(dateTime)).toThrow();
    });
});
