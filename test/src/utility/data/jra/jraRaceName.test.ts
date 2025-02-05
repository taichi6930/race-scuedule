import { validateJraRaceName } from '../../../../../lib/src/utility/data/jra/jraRaceName';

/**
 * JraRaceNameのテスト
 */
describe('JraRaceName', () => {
    describe('validateJraRaceName', () => {
        it('正常系', () => {
            expect(validateJraRaceName('中央競馬名')).toBe('中央競馬名');
        });

        it('異常系: 文字列なし', () => {
            expect(() => validateJraRaceName('')).toThrow(
                '空文字は許可されていません',
            );
        });

        it('異常系: undefined', () => {
            expect(() => validateJraRaceName(undefined)).toThrow(
                '中央競馬のレース名がundefinedです',
            );
        });
    });
});
