import { validateBoatracePlayerNumber } from '../../../../../lib/src/utility/data/boatrace/boatracePlayerNumber';

/**
 * BoatracePlayerNumberのテスト
 */
describe('BoatracePlayerNumber', () => {
    it('正常系: 選手番号が正常な場合', () => {
        const playerNumber = 1;
        const result = validateBoatracePlayerNumber(playerNumber);
        expect(result).toBe(playerNumber);
    });

    it('異常系: 選手番号が異常な場合', () => {
        const playerNumber = -1;
        expect(() => validateBoatracePlayerNumber(playerNumber)).toThrow(
            '選手番号は1以上である必要があります',
        );
    });
});
