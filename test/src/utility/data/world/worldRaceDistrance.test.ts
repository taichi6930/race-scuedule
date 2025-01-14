import { validateWorldRaceDistance } from '../../../../../lib/src/utility/data/world/worldRaceDistance';

/**
 * WorldRaceDistanceのテスト
 */
describe('WorldRaceDistance', () => {
    it('正常系: レース距離が正常な場合', () => {
        const distance = 1000;
        const result = validateWorldRaceDistance(distance);
        expect(result).toBe(distance);
    });

    it('異常系: レース距離が異常な場合', () => {
        const distance = -1;
        expect(() => validateWorldRaceDistance(distance)).toThrow(
            '距離は0よりも大きい必要があります',
        );
    });
});
