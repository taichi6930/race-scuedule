import { validateKeirinRaceDate } from '../../../../../lib/src/utility/data/keirin/keirinRaceDate';

/**
 * KeirinRaceDateのテスト
 */
describe('KeirinRaceDate', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateKeirinRaceDate(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('異常系', () => {
        const dateTime = '2021-01-01';
        expect(() => validateKeirinRaceDate(dateTime)).toThrow();
    });
});
