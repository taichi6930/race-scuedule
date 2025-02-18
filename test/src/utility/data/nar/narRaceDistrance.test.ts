import { validateNarRaceDistance } from '../../../../../lib/src/utility/data/nar/narRaceDistance';

/**
 * NarRaceDistanceのテスト
 */
describe('NarRaceDistance', () => {
    it('正常系: レース距離が正常な場合', () => {
        const distance = 1000;
        const result = validateNarRaceDistance(distance);
        expect(result).toBe(distance);
    });

    it('異常系: レース距離が異常な場合', () => {
        const distance = -1;
        expect(() => validateNarRaceDistance(distance)).toThrow(
            '距離は0よりも大きい必要があります',
        );
    });
});
