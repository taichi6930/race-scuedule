import { validateKeirinRaceDateTime } from '../../../../../lib/src/utility/data/keirin/keirinRaceDateTime';

/**
 * KeirinRaceDateTimeのテスト
 */
describe('KeirinRaceDateTime', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateKeirinRaceDateTime(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('異常系', () => {
        const dateTime = new Date('');
        expect(() => validateKeirinRaceDateTime(dateTime)).toThrow();
    });
});
