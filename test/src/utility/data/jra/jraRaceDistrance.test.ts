import { validateJraRaceDistance } from '../../../../../lib/src/utility/data/jra/jraRaceDistance';

/**
 * JraRaceDistanceのテスト
 */
describe('JraRaceDistance', () => {
    it('正常系: レース距離が正常な場合', () => {
        const distance = 1000;
        const result = validateJraRaceDistance(distance);
        expect(result).toBe(distance);
    });

    it('異常系: レース距離が異常な場合', () => {
        const distance = -1;
        expect(() => validateJraRaceDistance(distance)).toThrow(
            '距離は0よりも大きい必要があります',
        );
    });
});
