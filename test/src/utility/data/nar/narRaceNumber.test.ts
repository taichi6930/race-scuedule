import { validateNarRaceNumber } from '../../../../../lib/src/utility/data/nar/narRaceNumber';

/**
 * NarRaceNumberのテスト
 */
describe('NarRaceNumber', () => {
    it('正常系: レース番号が正常な場合', () => {
        const raceNumber = 1;
        const result = validateNarRaceNumber(raceNumber);
        expect(result).toBe(raceNumber);
    });

    it('異常系: レース番号が異常な場合', () => {
        const raceNumber = -1;
        expect(() => validateNarRaceNumber(raceNumber)).toThrow(
            'レース番号は1以上である必要があります',
        );
    });

    it('異常系: レース番号がundefinedの場合', () => {
        const raceNumber = undefined;
        expect(() => validateNarRaceNumber(raceNumber)).toThrow(
            'レース番号がundefinedです',
        );
    });
});
