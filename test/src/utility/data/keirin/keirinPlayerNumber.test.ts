import { validateKeirinPlayerNumber } from '../../../../../lib/src/utility/data/keirin/keirinPlayerNumber';

/**
 * KeirinPlayerNumberのテスト
 */
describe('KeirinPlayerNumber', () => {
    it('正常系: 選手番号が正常な場合', () => {
        const playerNumber = 1;
        const result = validateKeirinPlayerNumber(playerNumber);
        expect(result).toBe(playerNumber);
    });

    it('異常系: 選手番号が異常な場合', () => {
        const playerNumber = -1;
        expect(() => validateKeirinPlayerNumber(playerNumber)).toThrow(
            '選手番号は1以上である必要があります',
        );
    });
});
