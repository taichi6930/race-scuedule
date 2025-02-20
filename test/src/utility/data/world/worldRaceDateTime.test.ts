import { validateWorldRaceDateTime } from '../../../../../lib/src/utility/data/world/worldRaceDateTime';

/**
 * WorldRaceDateTimeのテスト
 */
describe('WorldRaceDateTime', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateWorldRaceDateTime(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('異常系', () => {
        const dateTime = new Date('');
        expect(() => validateWorldRaceDateTime(dateTime)).toThrow();
    });
});
