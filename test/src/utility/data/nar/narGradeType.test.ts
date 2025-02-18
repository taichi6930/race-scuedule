import { validateNarGradeType } from '../../../../../lib/src/utility/data/nar/narGradeType';

/**
 * NarGradeTypeのテスト
 */
describe('NarGradeType', () => {
    it('正常系: グレードが正常な場合', () => {
        const grade = 'GⅠ';
        const result = validateNarGradeType(grade);
        expect(result).toBe(grade);
    });

    it('異常系: グレードが空文字の場合', () => {
        const grade = 'G1';
        expect(() => validateNarGradeType(grade)).toThrow(
            '地方競馬のグレードではありません',
        );
    });
});
