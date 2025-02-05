import { validateJraRaceCourseType } from '../../../../../lib/src/utility/data/jra/jraRaceCourseType';

/**
 * JraRaceCourseTypeのテスト
 */
describe('JraRaceCourseType', () => {
    it('正常系: 中央競馬場タイプが正常な場合', () => {
        const courseType = '芝';
        const result = validateJraRaceCourseType(courseType);
        expect(result).toBe(courseType);
    });

    it('異常系: 中央競馬場タイプが異常な場合', () => {
        const courseType = 'テスト';
        expect(() => validateJraRaceCourseType(courseType)).toThrow(
            '中央競馬の馬場種別ではありません',
        );
    });

    it('異常系: 中央競馬場タイプがundefinedの場合', () => {
        const courseType = undefined;
        expect(() => validateJraRaceCourseType(courseType)).toThrow(
            '中央競馬の馬場種別がundefinedです',
        );
    });
});
