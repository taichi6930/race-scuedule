import { validateBoatraceRaceCourse } from '../../../../../lib/src/utility/data/boatrace/boatraceRaceCourse';

/**
 * BoatraceRaceCourseのテスト
 */
describe('BoatraceRaceCourse', () => {
    it('正常系: ボートレース場が正常な場合', () => {
        const course = '平和島';
        const result = validateBoatraceRaceCourse(course);
        expect(result).toBe(course);
    });

    it('異常系: ボートレース場が異常な場合', () => {
        const course = '東京';
        expect(() => validateBoatraceRaceCourse(course)).toThrow(
            'ボートレース場ではありません',
        );
    });
});
