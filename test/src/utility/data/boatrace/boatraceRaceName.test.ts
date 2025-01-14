import { validateBoatraceRaceName } from '../../../../../lib/src/utility/data/boatrace/boatraceRaceName';

/**
 * BoatraceRaceNameのテスト
 */
describe('BoatraceRaceName', () => {
    describe('validateBoatraceRaceName', () => {
        it('正常系', () => {
            expect(validateBoatraceRaceName('ボートレース名')).toBe(
                'ボートレース名',
            );
        });

        it('異常系', () => {
            expect(() => validateBoatraceRaceName('')).toThrow(
                '空文字は許可されていません',
            );
        });
    });
});
