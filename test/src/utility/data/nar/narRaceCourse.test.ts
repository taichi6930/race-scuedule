import { validateNarRaceCourse } from '../../../../../lib/src/utility/data/nar/narRaceCourse';

/**
 * NarRaceCourseのテスト
 */
describe('NarRaceCourse', () => {
    it('正常系: 地方競馬場が正常な場合', () => {
        const course = '大井';
        const result = validateNarRaceCourse(course);
        expect(result).toBe(course);
    });

    it('異常系: 地方競馬場が異常な場合', () => {
        const course = '東京';
        expect(() => validateNarRaceCourse(course)).toThrow(
            '地方の競馬場ではありません',
        );
    });

    it('異常系: 地方競馬場がundefinedの場合', () => {
        const course = undefined;
        expect(() => validateNarRaceCourse(course)).toThrow(
            '地方競馬の競馬場がundefinedです',
        );
    });
});
