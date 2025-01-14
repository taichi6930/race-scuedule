import { validateJraGradeType } from '../../../../../lib/src/utility/data/jra/jraGradeType';

/**
 * JraGradeTypeのテスト
 */
describe('JraGradeType', () => {
    it('正常系: グレードが正常な場合', () => {
        const grade = 'GⅠ';
        const result = validateJraGradeType(grade);
        expect(result).toBe(grade);
    });

    it('異常系: グレードが空文字の場合', () => {
        const grade = 'G1';
        expect(() => validateJraGradeType(grade)).toThrow(
            'JRAのグレードではありません',
        );
    });
});
