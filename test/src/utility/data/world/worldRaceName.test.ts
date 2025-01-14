import { validateWorldRaceName } from '../../../../../lib/src/utility/data/world/worldRaceName';

/**
 * WorldRaceNameのテスト
 */
describe('WorldRaceName', () => {
    describe('validateWorldRaceName', () => {
        it('正常系', () => {
            expect(validateWorldRaceName('海外競馬名')).toBe('海外競馬名');
        });

        it('異常系', () => {
            expect(() => validateWorldRaceName('')).toThrow(
                '空文字は許可されていません',
            );
        });
    });
});
