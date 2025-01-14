import { validateWorldRaceDate } from '../../../../../lib/src/utility/data/world/worldRaceDate';

/**
 * WorldRaceDateのテスト
 */
describe('WorldRaceDate', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateWorldRaceDate(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('異常系', () => {
        const dateTime = '2021-01-01';
        expect(() => validateWorldRaceDate(dateTime)).toThrow();
    });
});
