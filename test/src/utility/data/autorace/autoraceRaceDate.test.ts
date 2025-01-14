import { validateAutoraceRaceDate } from '../../../../../lib/src/utility/data/autorace/autoraceRaceDate';

/**
 * AutoraceRaceDateのテスト
 */
describe('AutoraceRaceDate', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateAutoraceRaceDate(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('異常系', () => {
        const dateTime = '2021-01-01';
        expect(() => validateAutoraceRaceDate(dateTime)).toThrow();
    });
});
