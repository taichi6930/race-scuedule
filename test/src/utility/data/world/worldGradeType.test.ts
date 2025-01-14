import { validateWorldGradeType } from '../../../../../lib/src/utility/data/world/worldGradeType';

/**
 * WorldGradeTypeのテスト
 */
describe('WorldGradeType', () => {
    it('正常系: グレードが正常な場合', () => {
        const grade = 'GⅠ';
        const result = validateWorldGradeType(grade);
        expect(result).toBe(grade);
    });

    it('異常系: グレードが空文字の場合', () => {
        const grade = 'G1';
        expect(() => validateWorldGradeType(grade)).toThrow(
            '海外競馬のグレードではありません',
        );
    });
});
