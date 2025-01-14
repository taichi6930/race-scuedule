import { validateNarRaceName } from '../../../../../lib/src/utility/data/nar/narRaceName';

/**
 * NarRaceNameのテスト
 */
describe('NarRaceName', () => {
    describe('validateNarRaceName', () => {
        it('正常系', () => {
            expect(validateNarRaceName('地方競馬名')).toBe('地方競馬名');
        });

        it('異常系', () => {
            expect(() => validateNarRaceName('')).toThrow(
                '空文字は許可されていません',
            );
        });
    });
});
