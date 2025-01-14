import { validateAutoraceRaceName } from '../../../../../lib/src/utility/data/autorace/autoraceRaceName';

/**
 * AutoraceRaceNameのテスト
 */
describe('AutoraceRaceName', () => {
    describe('validateAutoraceRaceName', () => {
        it('正常系', () => {
            expect(validateAutoraceRaceName('オートレース名')).toBe(
                'オートレース名',
            );
        });

        it('異常系', () => {
            expect(() => validateAutoraceRaceName('')).toThrow(
                '空文字は許可されていません',
            );
        });
    });
});
