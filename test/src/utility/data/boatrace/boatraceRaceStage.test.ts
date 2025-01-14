import { validateBoatraceRaceStage } from '../../../../../lib/src/utility/data/boatrace/boatraceRaceStage';

/**
 * BoatraceRaceStageクラスのテスト
 */
describe('BoatraceRaceStage', () => {
    describe('validateBoatraceRaceStage', () => {
        it('正常系', () => {
            expect(validateBoatraceRaceStage('優勝戦')).toBe('優勝戦');
        });

        it('異常系', () => {
            expect(() => validateBoatraceRaceStage('不正なステージ')).toThrow(
                'ボートレースのステージではありません',
            );
        });
    });
});
