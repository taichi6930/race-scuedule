import { validateKeirinRaceNumber } from '../../../../../lib/src/utility/data/keirin/keirinRaceNumber';

/**
 * KeirinRaceNumberのテスト
 */
describe('KeirinRaceNumber', () => {
    it('正常系: レース番号が正常な場合', () => {
        const raceNumber = 1;
        const result = validateKeirinRaceNumber(raceNumber);
        expect(result).toBe(raceNumber);
    });

    it('異常系: レース番号が異常な場合', () => {
        const raceNumber = -1;
        expect(() => validateKeirinRaceNumber(raceNumber)).toThrow(
            'レース番号は1以上である必要があります',
        );
    });
});
