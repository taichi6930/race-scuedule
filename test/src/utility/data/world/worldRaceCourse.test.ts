import { validateWorldRaceCourse } from '../../../../../lib/src/utility/data/world/worldRaceCourse';

/**
 * WorldRaceCourseのテスト
 */
describe('WorldRaceCourse', () => {
    it('正常系: 海外競馬場が正常な場合', () => {
        const course = 'ロンシャン';
        const result = validateWorldRaceCourse(course);
        expect(result).toBe(course);
    });

    it('異常系: 海外競馬場が異常な場合', () => {
        const course = '東京';
        expect(() => validateWorldRaceCourse(course)).toThrow(
            '海外競馬場ではありません',
        );
    });
});
