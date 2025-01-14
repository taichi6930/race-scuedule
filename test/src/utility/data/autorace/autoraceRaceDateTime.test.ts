import { validateAutoraceRaceDateTime } from '../../../../../lib/src/utility/data/autorace/autoraceRaceDateTime';

/**
 * AutoraceRaceDateTimeのテスト
 */
describe('AutoraceRaceDateTime', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateAutoraceRaceDateTime(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('異常系', () => {
        const dateTime = '2021-01-01';
        expect(() => validateAutoraceRaceDateTime(dateTime)).toThrow();
    });
});
