import { validateNarRaceDateTime } from '../../../../../lib/src/utility/data/nar/narRaceDateTime';

/**
 * NarRaceDateTimeのテスト
 */
describe('NarRaceDateTime', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateNarRaceDateTime(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('異常系', () => {
        const dateTime = new Date('');
        expect(() => validateNarRaceDateTime(dateTime)).toThrow();
    });
});
