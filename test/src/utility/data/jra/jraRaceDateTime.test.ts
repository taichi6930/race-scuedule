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

    it('異常系', () => {
        const dateTime = new Date('');
        expect(() => validateJraRaceDateTime(dateTime)).toThrow();
    });
});
