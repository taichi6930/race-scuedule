import { validateAutoracePlayerNumber } from '../../../../../lib/src/utility/data/autorace/autoracePlayerNumber';

/**
 * AutoracePlayerNumberのテスト
 */
describe('AutoracePlayerNumber', () => {
    it('正常系: 選手番号が正常な場合', () => {
        const playerNumber = 1;
        const result = validateAutoracePlayerNumber(playerNumber);
        expect(result).toBe(playerNumber);
    });

    it('異常系: 選手番号が異常な場合', () => {
        const playerNumber = -1;
        expect(() => validateAutoracePlayerNumber(playerNumber)).toThrow(
            '選手番号は1以上である必要があります',
        );
    });
});
