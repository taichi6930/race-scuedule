import { validateNarRaceCourseType } from '../../../../../lib/src/utility/data/nar/narRaceCourseType';

/**
 * NarRaceCourseTypeのテスト
 */
describe('NarRaceCourseType', () => {
    it('正常系: 地方競馬場タイプが正常な場合', () => {
        const courseType = '芝';
        const result = validateNarRaceCourseType(courseType);
        expect(result).toBe(courseType);
    });

    it('異常系: 地方競馬場タイプが異常な場合', () => {
        const courseType = 'テスト';
        expect(() => validateNarRaceCourseType(courseType)).toThrow(
            '地方競馬の馬場種別ではありません',
        );
    });
});
