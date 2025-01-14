import { validateKeirinGradeType } from '../../../../../lib/src/utility/data/keirin/keirinGradeType';

/**
 * KeirinGradeTypeのテスト
 */
describe('KeirinGradeType', () => {
    it('正常系: グレードが正常な場合', () => {
        const grade = 'GⅠ';
        const result = validateKeirinGradeType(grade);
        expect(result).toBe(grade);
    });

    it('異常系: グレードが空文字の場合', () => {
        const grade = 'G1';
        expect(() => validateKeirinGradeType(grade)).toThrow(
            '競輪のグレードではありません',
        );
    });
});
