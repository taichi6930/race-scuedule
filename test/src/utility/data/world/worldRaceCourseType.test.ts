import { validateWorldRaceCourseType } from '../../../../../lib/src/utility/data/world/worldRaceCourseType';

/**
 * WorldRaceCourseTypeのテスト
 */
describe('WorldRaceCourseType', () => {
    it('正常系: 海外競馬場タイプが正常な場合', () => {
        const courseType = '芝';
        const result = validateWorldRaceCourseType(courseType);
        expect(result).toBe(courseType);
    });

    it('異常系: 海外競馬場タイプが異常な場合', () => {
        const courseType = 'テスト';
        expect(() => validateWorldRaceCourseType(courseType)).toThrow(
            '海外競馬の馬場種別ではありません',
        );
    });
});
