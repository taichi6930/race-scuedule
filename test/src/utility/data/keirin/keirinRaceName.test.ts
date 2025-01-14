import { validateKeirinRaceName } from '../../../../../lib/src/utility/data/keirin/keirinRaceName';

/**
 * KeirinRaceNameのテスト
 */
describe('KeirinRaceName', () => {
    describe('validateKeirinRaceName', () => {
        it('正常系', () => {
            expect(validateKeirinRaceName('競輪名')).toBe('競輪名');
        });

        it('異常系', () => {
            expect(() => validateKeirinRaceName('')).toThrow(
                '空文字は許可されていません',
            );
        });
    });
});
