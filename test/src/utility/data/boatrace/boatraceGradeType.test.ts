import { validateBoatraceGradeType } from '../../../../../lib/src/utility/data/boatrace/boatraceGradeType';

/**
 * BoatraceGradeTypeのテスト
 */
describe('BoatraceGradeType', () => {
    it('正常系: グレードが正常な場合', () => {
        const grade = 'GⅠ';
        const result = validateBoatraceGradeType(grade);
        expect(result).toBe(grade);
    });

    it('異常系: グレードが空文字の場合', () => {
        const grade = 'G1';
        expect(() => validateBoatraceGradeType(grade)).toThrow(
            'ボートレースのグレードではありません',
        );
    });
});
