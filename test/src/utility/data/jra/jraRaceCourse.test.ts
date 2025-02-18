import { validateJraRaceCourse } from '../../../../../lib/src/utility/data/jra/jraRaceCourse';

/**
 * JraRaceCourseのテスト
 */
describe('JraRaceCourse', () => {
    it('正常系: 中央競馬場が正常な場合', () => {
        const course = '東京';
        const result = validateJraRaceCourse(course);
        expect(result).toBe(course);
    });

    it('異常系: 中央競馬場が異常な場合', () => {
        const course = '大井';
        expect(() => validateJraRaceCourse(course)).toThrow(
            '中央の競馬場ではありません',
        );
    });
});
