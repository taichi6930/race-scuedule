import { validateJraRaceDate } from '../../../../../lib/src/utility/data/jra/jraRaceDate';

/**
 * JraRaceDateのテスト
 */
describe('JraRaceDate', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateJraRaceDate(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('異常系', () => {
        const dateTime = '2021-01-01';
        expect(() => validateJraRaceDate(dateTime)).toThrow();
    });
});
