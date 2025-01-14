import { validateBoatraceRaceDate } from '../../../../../lib/src/utility/data/boatrace/boatraceRaceDate';

/**
 * BoatraceRaceDateのテスト
 */
describe('BoatraceRaceDate', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateBoatraceRaceDate(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('異常系', () => {
        const dateTime = '2021-01-01';
        expect(() => validateBoatraceRaceDate(dateTime)).toThrow();
    });
});
