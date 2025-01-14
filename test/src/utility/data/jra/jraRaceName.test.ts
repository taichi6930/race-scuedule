import { validateJraRaceName } from '../../../../../lib/src/utility/data/jra/jraRaceName';

/**
 * JraRaceNameのテスト
 */
describe('JraRaceName', () => {
    describe('validateJraRaceName', () => {
        it('正常系', () => {
            expect(validateJraRaceName('中央競馬名')).toBe('中央競馬名');
        });

        it('異常系', () => {
            expect(() => validateJraRaceName('')).toThrow(
                '空文字は許可されていません',
            );
        });
    });
});
