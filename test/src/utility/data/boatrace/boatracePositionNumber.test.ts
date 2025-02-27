import { validateBoatracePositionNumber } from '../../../../../lib/src/utility/data/boatrace/boatracePositionNumber';

/**
 * BoatracePositionNumberのテスト
 */
describe('BoatracePositionNumber', () => {
    it('正常系: 枠番が正常な場合', () => {
        const positionNumber = 1;
        const result = validateBoatracePositionNumber(positionNumber);
        expect(result).toBe(positionNumber);
    });

    it('異常系: 枠番が異常な場合', () => {
        const positionNumber = -1;
        expect(() => validateBoatracePositionNumber(positionNumber)).toThrow(
            '枠番は1以上である必要があります',
        );
    });
});
