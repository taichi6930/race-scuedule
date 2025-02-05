import { validateJraRaceDateTime } from '../../../../../lib/src/utility/data/jra/jraRaceDateTime';

/**
 * JraRaceDateTimeのテスト
 */
describe('JraRaceDateTime', () => {
    it('正常系', () => {
        const dateTime = new Date();
        const result = validateJraRaceDateTime(dateTime);
        expect(result).toStrictEqual(dateTime);
    });

    it('正常系 文字列', () => {
        const dateTime = '2021-01-01';
        const result = validateJraRaceDateTime(dateTime);
        expect(result).toStrictEqual(new Date(dateTime));
    });

    it('異常系', () => {
        const dateTime = '2021-01-500';
        expect(() => validateJraRaceDateTime(dateTime)).toThrow();
    });

    it('異常系 空文字', () => {
        const dateTime = undefined;
        expect(() => validateJraRaceDateTime(dateTime)).toThrow();
    });
});
