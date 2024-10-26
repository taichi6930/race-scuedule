import { KeirinRaceData } from '../../../lib/src/domain/keirinRaceData';

describe('KeirinRaceDataクラスのテスト', () => {
    /**
     * テスト用のKeirinRaceDataインスタンス
     */
    const baseRaceData = new KeirinRaceData(
        'KEIRINグランプリ',
        'グランプリ',
        new Date('2025-12-30 16:30'),
        '平塚',
        'GP',
        11,
    );

    it('正しい入力でKeirinRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        // インスタンスのプロパティが正しいか確認
        expect(raceData.name).toBe('KEIRINグランプリ');
        expect(raceData.dateTime).toEqual(new Date('2025-12-30 16:30'));
        expect(raceData.stage).toBe('グランプリ');
        expect(raceData.location).toBe('平塚');
        expect(raceData.grade).toBe('GP');
        expect(raceData.number).toBe(11);
    });

    it('何も変更せずKeirinRaceDataのインスタンスを作成できることを確認', () => {
        const raceData = baseRaceData;
        const newRaceData = raceData.copy();
        // インスタンスが変更されていないか確認
        expect(newRaceData).toEqual(raceData);
    });

    it('レース番号が範囲外の場合にエラーがスローされることを確認', () => {
        expect(() => {
            baseRaceData.copy({ number: 13 });
        }).toThrow('レース番号は1以上12以下である必要があります');
    });
});
