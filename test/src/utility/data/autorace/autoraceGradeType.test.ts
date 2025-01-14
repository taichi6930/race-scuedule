import { validateAutoraceGradeType } from '../../../../../lib/src/utility/data/autorace/autoraceGradeType';

/**
 * AutoraceGradeTypeのテスト
 */
describe('AutoraceGradeType', () => {
    it('正常系: グレードが正常な場合', () => {
        const grade = 'GⅠ';
        const result = validateAutoraceGradeType(grade);
        expect(result).toBe(grade);
    });

    it('異常系: グレードが空文字の場合', () => {
        const grade = 'G1';
        expect(() => validateAutoraceGradeType(grade)).toThrow(
            'オートレースのグレードではありません',
        );
    });
});
