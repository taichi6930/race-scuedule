import { validateAutoraceRaceCourse } from '../../../../../lib/src/utility/data/autorace/autoraceRaceCourse';

/**
 * AutoraceRaceCourseのテスト
 */
describe('AutoraceRaceCourse', () => {
    it('正常系: オートレース場が正常な場合', () => {
        const course = '船橋';
        const result = validateAutoraceRaceCourse(course);
        expect(result).toBe(course);
    });

    it('異常系: オートレース場が異常な場合', () => {
        const course = '東京';
        expect(() => validateAutoraceRaceCourse(course)).toThrow(
            'オートレース場ではありません',
        );
    });
});
