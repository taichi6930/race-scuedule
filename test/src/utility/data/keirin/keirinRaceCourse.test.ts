import { validateKeirinRaceCourse } from '../../../../../lib/src/utility/data/keirin/keirinRaceCourse';

/**
 * KeirinRaceCourseのテスト
 */
describe('KeirinRaceCourse', () => {
    it('正常系: 競輪場が正常な場合', () => {
        const course = '立川';
        const result = validateKeirinRaceCourse(course);
        expect(result).toBe(course);
    });

    it('異常系: 競輪場が異常な場合', () => {
        const course = '東京';
        expect(() => validateKeirinRaceCourse(course)).toThrow(
            '競輪場ではありません',
        );
    });
});
